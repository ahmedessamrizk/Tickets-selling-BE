import { Ticket } from './schema/tickets.schema';
import { User } from '../users/schema/users.schema';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { Model } from 'mongoose';
import { UpdateTicketDto } from './dtos/update-ticket.dto';
import { DiscountTicket } from '../discount-tickets/schema/discount-tickets.schema';
import { PaginationService } from '../../common/services/pagination.service';
import { GetTicketsDto } from './dtos/get-tickets.dto';
export declare class TicketsService {
    private ticketModel;
    private readonly discountTicketModel;
    private readonly paginationService;
    constructor(ticketModel: Model<Ticket>, discountTicketModel: Model<DiscountTicket>, paginationService: PaginationService);
    create(createTicketDto: CreateTicketDto, user: User): Promise<Ticket>;
    findOne(query: Partial<CreateTicketDto>, select?: string): Promise<Ticket>;
    checkValid(createTicketDto: Partial<CreateTicketDto>, id?: string): Promise<void>;
    findAll(query: GetTicketsDto, user: User): Promise<{
        total: number;
        totalPages: number;
        tickets: Ticket[];
    }>;
    update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket>;
    delete(id: string): Promise<null>;
}
