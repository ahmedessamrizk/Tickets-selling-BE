import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schema/tickets.schema';
import { DiscountTicket, DiscountTicketSchema } from '../discount-tickets/schema/discount-tickets.schema';
import { CommonModule } from '../../common/modules/common.module';
import { Payment, PaymentSchema } from '../payment/schema/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    MongooseModule.forFeature([{ name: DiscountTicket.name, schema: DiscountTicketSchema }]),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    CommonModule
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
