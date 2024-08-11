import { ConflictException, Injectable } from '@nestjs/common';
import { Ticket } from './schema/tickets.schema';
import { User } from '../users/schema/users.schema';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from '../../common/enums/roles.enum';
import { UpdateTicketDto } from './dtos/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<Ticket>) {}

  async create(createTicketDto: CreateTicketDto, user: User): Promise<Ticket> {
    // Check if ticket already exists with this name
    await this.checkValid(createTicketDto);

    Object.assign(createTicketDto, { createdBy: user._id });
    return this.ticketModel.create(createTicketDto);
  }

  findOne(query: Partial<Ticket>): Promise<Ticket> {
    return this.ticketModel.findOne(query);
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

  async findAll(user: User): Promise<Ticket[]> {
    let expose = {};
    // Remove quantity for users or guests
    if (!user || user.role === Role.User) {
      expose = { quantity: 0, createdBy: 0 };
    }

    const tickets = await this.ticketModel
      .find()
      .populate([
        {
          path: 'createdBy',
          select: 'name',
        },
      ])
      .select(expose);

    return tickets;
  }

  async update(
    id: string,
    updateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {
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
    //TODO: check discount-ticket for this ticket
    const ticket = await this.ticketModel.findByIdAndDelete(id);
    if (!ticket) {
      throw new ConflictException('Ticket not found');
    }
    return null;
  }
}
