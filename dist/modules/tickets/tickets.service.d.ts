import { Ticket } from './schema/tickets.schema';
import { User } from '../users/schema/users.schema';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { Model } from 'mongoose';
import { UpdateTicketDto } from './dtos/update-ticket.dto';
export declare class TicketsService {
    private ticketModel;
    constructor(ticketModel: Model<Ticket>);
    create(createTicketDto: CreateTicketDto, user: User): Promise<Ticket>;
    findOne(query: Partial<Ticket>): Promise<Ticket>;
    checkValid(createTicketDto: Partial<CreateTicketDto>, id?: string): Promise<void>;
    findAll(user: User): Promise<Ticket[]>;
    update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket>;
    delete(id: string): Promise<null>;
}
