import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import mongoose, { Model } from 'mongoose';
import { PaginationService } from '../../common/services/pagination.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { User } from '../users/schema/users.schema';
import { TicketsService } from '../tickets/tickets.service';
import { PaymentStatus } from '../../common/enums/payment.enum';
import { GetPaymentsDto } from './dtos/get-tickets.dto';
import { Role } from '../../common/enums/roles.enum';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private readonly paginationService: PaginationService,
    private readonly ticketsService: TicketsService,
  ) {}

  async create(
    createPaymentDto: CreatePaymentDto,
    user: User,
  ): Promise<Payment> {
    const { ticketId, quantity } = createPaymentDto;

    //check that ticket is valid
    const ticket = await this.ticketsService.findOne({ _id: ticketId });

    if (!ticket || ticket.expiry < new Date()) {
      throw new NotFoundException('Ticket expired or not found');
    }

    //check that ticket is not sold out
    if (ticket.quantity < quantity) {
      throw new NotFoundException('Not enough tickets available');
    }

    // Create payment with status pending
    const payment = new this.paymentModel({
      transactionId: new mongoose.Types.ObjectId().toString(),
      user: user._id,
      ticket: ticketId,
      quantity,
      deposit: ticket.price * quantity,
      status: PaymentStatus.Pending,
    });

    return payment.save();
  }

  async findAll(
    query: GetPaymentsDto,
    user: User,
  ): Promise<{ total: number; totalPages: number; payments: Payment[] }> {
    // if user ==> return his payments only, else ==> return all payments
    const filter = user.role === Role.User ? { user: user._id } : {};
    const userSelect = user.role === Role.User ? 'name' : 'name phoneNumber';
    const ticketSelect = user.role === Role.User ? 'name' : 'name quantity';

    const { page, size } = query;
    const { limit, skip } = this.paginationService.paginate(+page, +size);

    const [payments, totalPayments] = await Promise.all([
      this.paymentModel
        .find(filter)
        .limit(limit)
        .skip(skip)
        .populate([
          {
            path: 'user',
            select: userSelect,
          },
          {
            path: 'ticket',
            select: ticketSelect,
          },
        ])
        .sort({ createdAt: 1 }),
      this.paymentModel.find(filter).countDocuments(),
    ]);

    // Calculate the number of pages available
    const totalPages = Math.ceil(totalPayments / limit);

    return { total: totalPayments, totalPages, payments };
  }

  async findOne(id: string, user: User): Promise<Payment> {
    const filter =
      user.role === Role.User
        ? { transactionId: id['transactionId'], user: user._id }
        : { transactionId: id['transactionId'] };
    const ticketSelect =
      user.role === Role.User ? { name: 1 } : { name: 1, quantity: 1 };

    const payment = await this.paymentModel.findOne(filter).populate([
      { path: 'user', select: 'name' },
      { path: 'ticket', select: ticketSelect },
    ]);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async approvePayment(transactionId: string, user: User): Promise<Payment> {
    // Check if payment exists
    const payment = await this.findOne(transactionId, user);
    const ticket = await this.ticketsService.findOne({ _id: payment.ticket });

    if (payment.status === PaymentStatus.Success) {
      throw new BadRequestException('Payment is already approved');
    }
    if (ticket.quantity < payment.quantity) {
      throw new BadRequestException('Ticket quantity is not enough');
    }
    if (new Date() > ticket.expiry) {
      throw new BadRequestException('Ticket expiry date is reached');
    }

    // Prepare update operations
    const updateTicket = this.ticketsService.update(ticket['_id'], {
      quantity: ticket.quantity - payment.quantity,
    });
    payment.status = PaymentStatus.Success;
    const updatePayment = await (payment as PaymentDocument).save();
    Object.assign(payment.ticket, {
      quantity: ticket.quantity - payment.quantity,
    });

    // Perform updates concurrently
    await Promise.all([updateTicket, updatePayment]);

    return payment;
  }

  async rejectPayment(transactionId: string, user: User) {
    const payment = (await this.findOne(
      transactionId,
      user,
    )) as PaymentDocument;
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    //If payment was marked as success, then reject it and return quantity of tickets.
    if (payment.status === PaymentStatus.Success) {
      const ticket = await this.ticketsService.update(payment.ticket, {
        quantity: payment.ticket['quantity'] + payment.quantity,
      });
      Object.assign(payment.ticket, {
        quantity: ticket.quantity,
      });
    }

    payment.status = PaymentStatus.Fail;
    return payment.save();
  }

  async getUsersForDiscountTicket(
    ticketId: string,
    winners: any,
  ): Promise<any> {
    ticketId = ticketId.toString();
    const users = await this.paymentModel
      .aggregate([
        {
          $addFields: {
            user: { $toObjectId: '$user' },
          },
        },
        {
          $match: {
            ticket: ticketId,
            status: PaymentStatus.Success,
            user: { $nin: winners }, // Ensure user is not empty
          },
        },
        {
          $group: {
            _id: '$user',
            quantity: { $sum: '$quantity' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true }, // Try without unwind first to see if results are coming in array form
        },
        {
          $project: {
            _id: 0,
            userDetails: {
              _id: 1,
              name: 1,
              phoneNumber: 1,
            },
            quantity: 1,
          },
        },
      ])
      .exec();

    return users;
  }

  // Runs every day to reject payments that are expired or out of stock
  @Cron('0 0 * * * ')
  async handleExpiredOrOutOfStockPayments() {
    const now = new Date();

    // Find payments where the ticket is out of stock or expired
    const payments = await this.paymentModel
      .find({
        status: PaymentStatus.Pending,
      })
      .populate('ticket');

    const updates = payments.map(async (payment) => {
      const ticket = payment.ticket as any;

      if (ticket.quantity < payment.quantity || ticket.expiry < now) {
        payment.status = PaymentStatus.Fail;
        await payment.save();
      }
    });

    await Promise.all(updates);
  }

  //Analytics
  async getUserBuysTicket(order: 1 | -1): Promise<any> {
    const result = await this.paymentModel
      .aggregate([
        {
          $addFields: {
            user: { $toObjectId: '$user' },
          },
        },
        { $match: { status: PaymentStatus.Success } }, // Consider only successful payments
        {
          $group: {
            _id: '$user',
            totalBought: { $sum: '$quantity' },
          },
        },
        { $sort: { totalBought: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: 'users', // Ensure this is the correct collection name
            localField: '_id', // Field from payments (user field)
            foreignField: '_id', // Field from users to match with localField
            as: 'userDetails', // Name of the new field to add with user details
          },
        },
        { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0, // Include payment _id
            userDetails: {
              _id: 1, // Include user _id
              name: 1, // Include user name
              phoneNumber: 1, // Include user phone number
            },
            totalBought: 1, // Include payment creation date
          },
        },
      ])
      .exec();

    return result;
  }

  async getTicketBought(order: 1 | -1, limit: number = 1, select: {} = { _id: 1, name: 1 }): Promise<any> {
    return this.paymentModel.aggregate([
      { $addFields: { ticket: { $toObjectId: '$ticket' } } },
      { $match: { status: PaymentStatus.Success } }, // Consider only successful payments
      { $group: { _id: '$ticket', totalSold: { $sum: '$quantity' } } }, // Group by ticketId and sum the quantities
      { $sort: { totalSold: order } }, // Sort by total tickets in ascending order
      { $limit: limit }, // Limit to the ticket with the least purchases
      {
        $lookup: {
          from: 'tickets',
          localField: '_id',
          foreignField: '_id',
          as: 'ticket',
        },
      }, // Populate ticket details
      { $unwind: { path: '$ticket', preserveNullAndEmptyArrays: true } }, // Unwind ticket array
      { $project: { _id: 0, totalSold: 1, ticket: select } }, // Return the ticket and total tickets
    ]);
  }

  async getAnalytics(): Promise<any> {
    const [mostActiveUser, mostTicketBought, leastTicketBought] =
      await Promise.all([
        this.getUserBuysTicket(-1),
        this.getTicketBought(-1),
        this.getTicketBought(1),
      ]);

    return {
      mostActiveUser: mostActiveUser[0],
      mostTicketBought: mostTicketBought[0],
      leastTicketBought: leastTicketBought[0],
    };
  }
  //================================================================================================
}
