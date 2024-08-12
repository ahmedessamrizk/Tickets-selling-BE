import { CreateDiscountTicketDto } from './dtos/create-discount-tickets.dto';
import { DiscountTicket } from './schema/discount-tickets.schema';
import { Model } from 'mongoose';
import { TicketsService } from '../tickets/tickets.service';
import { Ticket } from '../tickets/schema/tickets.schema';
import { UpdateDiscountTaskDto } from './dtos/update-discount-task.dto';
export declare class DiscountTicketsService {
    private readonly discountTicketModel;
    private readonly ticketsService;
    constructor(discountTicketModel: Model<DiscountTicket>, ticketsService: TicketsService);
    populate: {
        path: string;
        select: string;
    }[];
    findOne(query: any): Promise<DiscountTicket>;
    create(createDiscountTicketDto: CreateDiscountTicketDto): Promise<DiscountTicket>;
    checkValidTicket(ticket: string): Promise<Ticket>;
    findAll(): Promise<DiscountTicket[]>;
    findById(id: string): Promise<DiscountTicket>;
    update(id: string, updateDiscountTaskDto: UpdateDiscountTaskDto): Promise<DiscountTicket>;
    delete(id: string): Promise<null>;
}
