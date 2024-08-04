import { ConflictException, Injectable } from '@nestjs/common';
import { Ticket } from './schema/tickets.schema';
import { User } from '../users/schema/users.schema';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from 'src/common/enums/roles.enum';

@Injectable()
export class TicketsService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<Ticket>) {}

  async create(createTicketDto: CreateTicketDto, user: User): Promise<Ticket> {
    // Check if ticket already exists with this name
    const ticket = await this.findOne({ name: createTicketDto.name });
    if (ticket) {
      throw new ConflictException('Ticket already exists');
    }

    Object.assign(createTicketDto, { createdBy: user._id });
    return this.ticketModel.create(createTicketDto);
  }

  findOne(query: Partial<Ticket>): Promise<Ticket> {
    return this.ticketModel.findOne(query);
  }

  async findAll(user: User): Promise<Ticket[]> {
    let expose = {};
    // Remove quantity for users or guests
    if (!user || user.role === Role.User) {
      expose = { quantity: 0 };
    }

    const tickets = await this.ticketModel
      .find()
      .populate([
        {
          path: 'createdBy',
          select: 'name role',
        },
      ])
      .select(expose);

    return tickets;
  }
}
