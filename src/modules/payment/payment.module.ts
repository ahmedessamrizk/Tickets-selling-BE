import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { CommonModule } from 'src/common/modules/common.module';
import { TicketsModule } from '../tickets/tickets.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    CommonModule,
    TicketsModule,
    ScheduleModule.forRoot()
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
