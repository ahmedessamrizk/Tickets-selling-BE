import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Ticket } from './schema/tickets.schema';
import { User } from '../users/schema/users.schema';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from '../../common/enums/roles.enum';
import { UpdateTicketDto } from './dtos/update-ticket.dto';
import { DiscountTicket } from '../discount-tickets/schema/discount-tickets.schema';
import { PaginationService } from '../../common/services/pagination.service';
import { GetTicketsDto } from './dtos/get-tickets.dto';
import { Payment } from '../payment/schema/payment.schema';
import { PaymentStatus } from 'src/common/enums/payment.enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectModel(DiscountTicket.name)
    private readonly discountTicketModel: Model<DiscountTicket>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createTicketDto: CreateTicketDto, user: User): Promise<Ticket> {
    // Check if ticket already exists with this name
    await this.checkValid(createTicketDto);

    Object.assign(createTicketDto, { createdBy: user._id });
    return this.ticketModel.create(createTicketDto);
  }

  findOne(query: any, select = ''): Promise<Ticket> {
    return this.ticketModel.findOne(query).select(select);
  }

  async checkValid(
    createTicketDto: Partial<CreateTicketDto>,
    id: string = '',
  ): Promise<void> {
    const ticket = await this.findOne({ name: createTicketDto.name });
    if (ticket) {
      if (id !== ticket['_id'].toString()) {
        throw new ConflictException('Ticket with this name already exists');
      }
    }
  }

  async findAll(
    query: GetTicketsDto,
    user: User,
  ): Promise<{ total: number; totalPages: number; tickets: Ticket[] }> {
    let expose = {},
      filter = {},
      sort = {};
    // Remove quantity for users or guests
    if (!user || user.role === Role.User) {
      expose = { quantity: 0, createdBy: 0 };
      filter = { quantity: { $gt: 0 } };
    }
    if (query.sortBy) {
      sort[query['sortBy']] = Number(query.sortOrder) || -1;
    } else {
      sort = { createdAt: -1 };
    }

    const { page, size } = query;

    const { limit, skip } = this.paginationService.paginate(+page, +size);

    const [tickets, totalTickets] = await Promise.all([
      this.ticketModel
        .find(filter)
        .limit(limit)
        .skip(skip)
        .populate([
          {
            path: 'createdBy',
            select: 'name',
          },
        ])
        .select(expose)
        .sort(sort),
      this.ticketModel.find(filter).countDocuments(),
    ]);
    // Calculate the number of pages available
    const totalPages = Math.ceil(totalTickets / limit);

    return { total: totalTickets, totalPages, tickets };
  }

  async update(id: any, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    if (updateTicketDto.name) {
      await this.checkValid(updateTicketDto, id);
    }

    //update ticket and return it
    const updatedTicket = await this.ticketModel.findByIdAndUpdate(
      id,
      updateTicketDto,
      { new: true },
    );
    if (!updatedTicket) {
      throw new ConflictException('Ticket not found');
    }
    return updatedTicket;
  }

  async delete(id: string): Promise<null> {
    const ticket = await this.ticketModel.findById(id);

    //Don't delete ticket which is used in payment
    if (!ticket) {
      throw new ConflictException('Ticket not found');
    }

    if (ticket.expiry > new Date()) {
      const payment = await this.paymentModel.findOne({
        ticket: id,
        status: { $in: [PaymentStatus.Pending, PaymentStatus.Success] },
      });
      if (payment) {
        throw new BadRequestException('Ticket is used in payment');
      }
    }

    //check discount-ticket for this ticket
    const discountTicket = await this.discountTicketModel
      .findOne({
        ticket: id,
      })
      .populate('ticket');

    if (discountTicket) {
      throw new BadRequestException('Ticket has spin wheel');
    }

    await this.ticketModel.deleteOne({ ticket: id });
    return null;
  }
}
