import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket } from './schema/tickets.schema';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/schema/users.schema';
import { Public } from '../../common/decorators/public.decorator';

@Controller('/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(RolesGuard)
  async createTicket(
    @Body() createTicketDto: CreateTicketDto,
    @CurrentUser() user: User,
  ): Promise<Ticket> {
    return this.ticketsService.create(createTicketDto, user);
  }

  @Public()
  @Get()
  async getTicketsForUsers(): Promise<Ticket[]> {
    return this.ticketsService.findAll(null);
  }

  @Get('/admin')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(RolesGuard)
  async getTicketsForAdmins(@CurrentUser() user: User): Promise<Ticket[]> {
    return this.ticketsService.findAll(user);
  }

  // @Patch()
  // @Roles(Role.Admin, Role.SuperAdmin)
  // @UseGuards(RolesGuard)
  // updateTicket(@Body() updateTicketDto: Partial<CreateTicketDto>, @CurrentUser() user: User): Promise<Ticket> {
  //   return this.ticketsService.update(updateTicketDto, user);

  // }
}
