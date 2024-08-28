import { Module } from '@nestjs/common';
import { DiscountTicketsController } from './discount-tickets.controller';
import { DiscountTicketsService } from './discount-tickets.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DiscountTicket,
  DiscountTicketSchema,
} from './schema/discount-tickets.schema';
import { TicketsModule } from '../tickets/tickets.module';
import { CommonModule } from '../../common/modules/common.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiscountTicket.name, schema: DiscountTicketSchema },
    ]),
    TicketsModule,
    CommonModule,
    PaymentModule,
  ],
  controllers: [DiscountTicketsController],
  providers: [DiscountTicketsService],
})
export class DiscountTicketsModule {}
