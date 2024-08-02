import { Module } from '@nestjs/common';
import { DiscountTicketsController } from './discount-tickets.controller';
import { DiscountTicketsService } from './discount-tickets.service';

@Module({
  controllers: [DiscountTicketsController],
  providers: [DiscountTicketsService]
})
export class DiscountTicketsModule {}
