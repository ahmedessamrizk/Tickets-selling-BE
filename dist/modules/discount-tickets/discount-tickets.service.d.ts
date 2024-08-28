import { CreateDiscountTicketDto } from './dtos/create-discount-tickets.dto';
import { DiscountTicket } from './schema/discount-tickets.schema';
import { Model } from 'mongoose';
import { TicketsService } from '../tickets/tickets.service';
import { Ticket } from '../tickets/schema/tickets.schema';
import { UpdateDiscountTaskDto } from './dtos/update-discount-task.dto';
import { GetDiscountTicketsDto } from './dtos/get-discount-tickets.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaymentService } from '../payment/payment.service';
export declare class DiscountTicketsService {
    private readonly discountTicketModel;
    private readonly ticketsService;
    private readonly paginationService;
    private readonly paymentService;
    constructor(discountTicketModel: Model<DiscountTicket>, ticketsService: TicketsService, paginationService: PaginationService, paymentService: PaymentService);
    populate: {
        path: string;
        select: string;
    }[];
    findOne(query: any): Promise<DiscountTicket>;
    create(createDiscountTicketDto: CreateDiscountTicketDto): Promise<DiscountTicket>;
    checkValidTicket(ticket: string): Promise<Ticket>;
    findAll(query: GetDiscountTicketsDto): Promise<{
        total: number;
        totalPages: number;
        discountTickets: DiscountTicket[];
    }>;
    findById(id: string): Promise<DiscountTicket>;
    update(id: string, updateDiscountTaskDto: UpdateDiscountTaskDto): Promise<DiscountTicket>;
    delete(id: string): Promise<null>;
    addWinner(discountTicketId: string, userId: string): Promise<DiscountTicket>;
    getWinners(discountTicketId: string): Promise<any>;
}
