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

@Injectable()
export class DiscountTicketsService {
  constructor(
    @InjectModel(DiscountTicket.name)
    private readonly discountTicketModel: Model<DiscountTicket>,
    private readonly ticketsService: TicketsService,
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
      'name',
    );
    if (!checkTicket) {
      throw new NotFoundException('The provided ticket does not exist');
    }

    //check that ticketId is unique
    const discountTicket = await this.findOne({
      ticket: ticket,
    });
    if (discountTicket) {
      throw new ConflictException(
        'The provided ticket already has a discount ticket',
      );
    }

    return checkTicket;
  }

  async findAll(): Promise<DiscountTicket[]> {
    return this.discountTicketModel.find().populate(this.populate);
  }

  async findById(id: string): Promise<DiscountTicket> {
    return this.discountTicketModel.findById(id).populate(this.populate);
  }

  async update(
    id: string,
    updateDiscountTaskDto: UpdateDiscountTaskDto,
  ): Promise<DiscountTicket> {
    if (updateDiscountTaskDto.ticket) {
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
    const deleteDiscountTicket = await this.discountTicketModel.findByIdAndDelete(id);
    if (!deleteDiscountTicket) {
      throw new NotFoundException('Discount ticket not found');
    }
    return null;
  }
}
