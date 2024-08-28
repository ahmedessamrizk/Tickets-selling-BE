import { Payment } from './schema/payment.schema';
import mongoose, { Model } from 'mongoose';
import { PaginationService } from '../../common/services/pagination.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { User } from '../users/schema/users.schema';
import { TicketsService } from '../tickets/tickets.service';
import { GetPaymentsDto } from './dtos/get-tickets.dto';
export declare class PaymentService {
    private paymentModel;
    private readonly paginationService;
    private readonly ticketsService;
    constructor(paymentModel: Model<Payment>, paginationService: PaginationService, ticketsService: TicketsService);
    create(createPaymentDto: CreatePaymentDto, user: User): Promise<Payment>;
    findAll(query: GetPaymentsDto, user: User): Promise<{
        total: number;
        totalPages: number;
        payments: Payment[];
    }>;
    findOne(id: string, user: User): Promise<Payment>;
    approvePayment(transactionId: string, user: User): Promise<Payment>;
    rejectPayment(transactionId: string, user: User): Promise<mongoose.Document<unknown, {}, Payment> & Payment & {
        _id: mongoose.Types.ObjectId;
    }>;
    handleExpiredOrOutOfStockPayments(): Promise<void>;
    getUserBuysTicket(order: 1 | -1): Promise<any>;
    getTicketBought(order: 1 | -1): Promise<any>;
    getAnalytics(): Promise<any>;
}
