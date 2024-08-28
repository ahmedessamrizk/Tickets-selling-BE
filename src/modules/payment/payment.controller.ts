import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/roles.enum';
import { PaymentService } from './payment.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { GetPaymentsDto } from './dtos/get-tickets.dto';
import { Payment } from './schema/payment.schema';
import { User } from '../users/schema/users.schema';

@Controller('/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user: User,
  ): Promise<Payment> {
    return this.paymentService.create(createPaymentDto, user);
  }

  @Get()
  getPayments(
    @Query() query: GetPaymentsDto,
    @CurrentUser() user: User,
  ): Promise<{ total: number; totalPages: number; payments: Payment[] }> {
    return this.paymentService.findAll(query, user);
  }

  @Get('/analytics')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(RolesGuard)
  getAnalytics(): Promise<any> {
    return this.paymentService.getAnalytics();
  }

  @Get('/most-sold')
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  getMostSoldTickets(@Query() query: any): Promise<any> {
    const quantity = query.quantity ? Number(query.quantity) : 5;
    return this.paymentService.getTicketBought(-1, quantity, {
      _id: 1,
      name: 1,
      price: 1,
      desc: 1,
      ImageURL: 1,
    });
  }

  @Get('/:transactionId')
  getPayment(
    @Param() transactionId: string,
    @CurrentUser() user: User,
  ): Promise<Payment> {
    return this.paymentService.findOne(transactionId, user);
  }

  @Post('/:transactionId/approve')
  @Roles(Role.Admin, Role.SuperAdmin)
  @HttpCode(200)
  @UseGuards(RolesGuard)
  approvePayment(
    @Param() transactionId: string,
    @CurrentUser() user: User,
  ): Promise<Payment> {
    return this.paymentService.approvePayment(transactionId, user);
  }

  @Post('/:transactionId/reject')
  @Roles(Role.Admin, Role.SuperAdmin)
  @HttpCode(200)
  @UseGuards(RolesGuard)
  rejectPayment(
    @Param() transactionId: string,
    @CurrentUser() user: User,
  ): Promise<Payment> {
    return this.paymentService.rejectPayment(transactionId, user);
  }
}
