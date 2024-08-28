import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DiscountTicket } from './schema/discount-tickets.schema';
import { CreateDiscountTicketDto } from './dtos/create-discount-tickets.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { DiscountTicketsService } from './discount-tickets.service';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { DiscountTicketDto } from './dtos/discount-ticket.dto';
import { UpdateDiscountTaskDto } from './dtos/update-discount-task.dto';
import { GetDiscountTicketsDto } from './dtos/get-discount-tickets.dto';

@Controller('/discount-tickets')
@UseGuards(RolesGuard)
export class DiscountTicketsController {
  constructor(
    private readonly discountTicketsService: DiscountTicketsService,
  ) {}

  @Post()
  @Roles(Role.Admin, Role.SuperAdmin)
  @Serialize(DiscountTicketDto)
  createDiscountTicket(
    @Body() body: CreateDiscountTicketDto,
  ): Promise<DiscountTicket> {
    return this.discountTicketsService.create(body);
  }

  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  getDiscountTickets(@Query() query: GetDiscountTicketsDto): Promise<{
    total: number;
    totalPages: number;
    discountTickets: DiscountTicket[];
  }> {
    return this.discountTicketsService.findAll(query);
  }

  @Get('/:id/winners')
  @Roles(Role.Admin, Role.SuperAdmin)
  getDiscountTicketsWinners(
    @Param('id') id: string,
  ): Promise<DiscountTicket[]> {
    return this.discountTicketsService.getWinners(id);
  }

  @Get('/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  getDiscountTicket(@Param('id') id: string): Promise<DiscountTicket> {
    return this.discountTicketsService.findById(id);
  }

  @Patch('/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @Serialize(DiscountTicketDto)
  updateDiscountTicket(
    @Body() body: UpdateDiscountTaskDto,
    @Param('id') id: string,
  ): Promise<DiscountTicket> {
    return this.discountTicketsService.update(id, body);
  }

  @Delete('/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @HttpCode(204)
  deleteDiscountTicket(@Param('id') id: string): Promise<null> {
    return this.discountTicketsService.delete(id);
  }

  @Post('/:id/winners/:userId')
  @Roles(Role.Admin, Role.SuperAdmin)
  @HttpCode(200)
  addWinner(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<DiscountTicket> {
    return this.discountTicketsService.addWinner(id, userId);
  }
}
