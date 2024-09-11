import {
  Body,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDiscountTicketDto } from './dtos/create-discount-tickets.dto';
import { DiscountTicket } from './schema/discount-tickets.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketsService } from '../tickets/tickets.service';
import { Ticket } from '../tickets/schema/tickets.schema';
import { UpdateDiscountTaskDto } from './dtos/update-discount-task.dto';
import { GetDiscountTicketsDto } from './dtos/get-discount-tickets.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class DiscountTicketsService {
  constructor(
    @InjectModel(DiscountTicket.name)
    private readonly discountTicketModel: Model<DiscountTicket>,
    private readonly ticketsService: TicketsService,
    private readonly paginationService: PaginationService,
    private readonly paymentService: PaymentService,
  ) {}

  populate = [
    {
      path: 'ticket',
      select: 'name',
    },
    {
      path: 'winners',
      select: 'name phoneNumber',
    },
  ];

  findOne(query: any): Promise<DiscountTicket> {
    return this.discountTicketModel.findOne(query);
  }

  async create(
    @Body() createDiscountTicketDto: CreateDiscountTicketDto,
  ): Promise<DiscountTicket> {
    const checkTicket = await this.checkValidTicket(
      createDiscountTicketDto.ticket,
    );

    if (checkTicket.sold === 0) {
      throw new ConflictException('Ticket has not been sold yet');
    }

    if (createDiscountTicketDto.limit >= checkTicket.sold) {
      throw new ConflictException(
        'Limit cannot be greater than or equal to the number of tickets sold',
      );
    }

    let createdDiscountTicket = await this.discountTicketModel.create(
      createDiscountTicketDto,
    );

    return {
      ...createdDiscountTicket.toObject(),
      ticket: {
        ...checkTicket['_doc'],
      },
    };
  }

  async checkValidTicket(ticket: string): Promise<Ticket> {
    //check that ticketId is valid
    const checkTicket = await this.ticketsService.findOne(
      { _id: ticket },
      'name expiry sold',
    );
    if (!checkTicket) {
      throw new NotFoundException('The provided ticket does not exist');
    }

    if (checkTicket.expiry > new Date()) {
      throw new ConflictException("The provided ticket hasn't expired yet");
    }

    //check that ticketId is unique
    const discountTicket = await this.findOne({
      ticket: ticket,
    });
    if (discountTicket) {
      throw new ConflictException(
        'The provided ticket already has a spin wheel',
      );
    }

    return checkTicket;
  }

  async findAll(query: GetDiscountTicketsDto): Promise<{
    total: number;
    totalPages: number;
    discountTickets: DiscountTicket[];
  }> {
    const { page, size } = query;

    const { limit, skip } = this.paginationService.paginate(+page, +size);

    const [discountTickets, totalDiscountTickets] = await Promise.all([
      this.discountTicketModel
        .find()
        .limit(limit)
        .skip(skip)
        .populate(this.populate)
        .sort({ createdAt: -1 }),
      this.discountTicketModel.find().countDocuments(),
    ]);
    // Calculate the number of pages available
    const totalPages = Math.ceil(totalDiscountTickets / limit);

    return { total: totalDiscountTickets, totalPages, discountTickets };
  }

  async findById(id: string): Promise<DiscountTicket> {
    let discountTicket = (await this.discountTicketModel
      .findById(id)
      .select('name ticket limit used winners').populate({path: 'ticket', select: 'sold'})) as any;
    if (!discountTicket) {
      throw new NotFoundException('Discount ticket not found');
    }
    discountTicket = discountTicket.toObject();
    const users = await this.paymentService.getUsersForDiscountTicket(
      discountTicket.ticket._id,
      discountTicket.winners,
    );

    Object.assign(discountTicket, { users });
    return discountTicket;
  }

  async update(
    id: string,
    updateDiscountTaskDto: UpdateDiscountTaskDto,
  ): Promise<DiscountTicket> {
    if (updateDiscountTaskDto.ticket === null) {
      delete updateDiscountTaskDto.ticket;
    }
    if (updateDiscountTaskDto.ticket) {
      console.log('entered');
      await this.checkValidTicket(updateDiscountTaskDto.ticket);
    }

    const updateDiscountTicket =
      await this.discountTicketModel.findByIdAndUpdate(
        id,
        updateDiscountTaskDto,
        {
          new: true,
        },
      );

    if (!updateDiscountTicket) {
      throw new NotFoundException('Discount ticket not found');
    }

    return updateDiscountTicket;
  }

  async delete(id: string): Promise<null> {
    const deleteDiscountTicket =
      await this.discountTicketModel.findByIdAndDelete(id);
    if (!deleteDiscountTicket) {
      throw new NotFoundException('Discount ticket not found');
    }
    return null;
  }

  async addWinner(
    discountTicketId: string,
    userId: string,
  ): Promise<DiscountTicket> {
    const discountTicket =
      await this.discountTicketModel.findById(discountTicketId);
    if (!discountTicket) {
      throw new NotFoundException('Discount ticket not found');
    }
    const ticket = await this.ticketsService.findOne(
      {
        _id: discountTicket.ticket,
      },
      'expiry',
    );

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (ticket.expiry > new Date()) {
      throw new ConflictException('Ticket not expired yet');
    }

    if (discountTicket.used >= discountTicket.limit) {
      throw new ConflictException(
        'Spin has reached its limit for winners size',
      );
    }
    if (discountTicket.winners.includes(userId as any)) {
      throw new ConflictException('User has already won this spin');
    }
    discountTicket.winners.push(userId);
    discountTicket.used += 1;

    await discountTicket.save();

    return discountTicket;
  }

  async getWinners(discountTicketId: string): Promise<any> {
    const discountTicket = await this.discountTicketModel
      .findById(discountTicketId)
      .select('ticket winners')
      .populate('winners', 'name phoneNumber');
    if (!discountTicket) {
      throw new NotFoundException('Discount ticket not found');
    }

    return discountTicket;
  }
}
