import { Module } from '@nestjs/common';
import { DiscountTicketsController } from './discount-tickets.controller';
import { DiscountTicketsService } from './discount-tickets.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DiscountTicket,
  DiscountTicketSchema,
} from './schema/discount-tickets.schema';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiscountTicket.name, schema: DiscountTicketSchema },
    ]),
    TicketsModule
  ],
  controllers: [DiscountTicketsController],
  providers: [DiscountTicketsService],
})
export class DiscountTicketsModule {}
