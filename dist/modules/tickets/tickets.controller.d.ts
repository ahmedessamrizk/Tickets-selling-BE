import { TicketsService } from './tickets.service';
import { Ticket } from './schema/tickets.schema';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { User } from '../users/schema/users.schema';
import { UpdateTicketDto } from './dtos/update-ticket.dto';
import { GetTicketsDto } from './dtos/get-tickets.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    createTicket(createTicketDto: CreateTicketDto, user: User): Promise<Ticket>;
    getTicketsForUsers(query: GetTicketsDto): Promise<{
        total: number;
        totalPages: number;
        tickets: Ticket[];
    }>;
    getTicketsForAdmins(query: GetTicketsDto, user: User): Promise<{
        total: number;
        totalPages: number;
        tickets: Ticket[];
    }>;
    getTicketsForSpin(): Promise<Ticket[]>;
    updateTicket(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket>;
    deleteTicket(id: string): Promise<null>;
}
