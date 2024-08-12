import { DiscountTicket } from './schema/discount-tickets.schema';
import { CreateDiscountTicketDto } from './dtos/create-discount-tickets.dto';
import { DiscountTicketsService } from './discount-tickets.service';
import { UpdateDiscountTaskDto } from './dtos/update-discount-task.dto';
export declare class DiscountTicketsController {
    private readonly discountTicketsService;
    constructor(discountTicketsService: DiscountTicketsService);
    createDiscountTicket(body: CreateDiscountTicketDto): Promise<DiscountTicket>;
    getDiscountTickets(): Promise<DiscountTicket[]>;
    getDiscountTicket(id: string): Promise<DiscountTicket>;
    updateDiscountTicket(body: UpdateDiscountTaskDto, id: string): Promise<DiscountTicket>;
    deleteDiscountTicket(id: string): Promise<null>;
}
