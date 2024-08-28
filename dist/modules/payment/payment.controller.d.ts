import { CreatePaymentDto } from './dtos/create-payment.dto';
import { PaymentService } from './payment.service';
import { GetPaymentsDto } from './dtos/get-tickets.dto';
import { Payment } from './schema/payment.schema';
import { User } from '../users/schema/users.schema';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPayment(createPaymentDto: CreatePaymentDto, user: User): Promise<Payment>;
    getPayments(query: GetPaymentsDto, user: User): Promise<{
        total: number;
        totalPages: number;
        payments: Payment[];
    }>;
    getAnalytics(): Promise<any>;
    getPayment(transactionId: string, user: User): Promise<Payment>;
    approvePayment(transactionId: string, user: User): Promise<Payment>;
    rejectPayment(transactionId: string, user: User): Promise<Payment>;
}
