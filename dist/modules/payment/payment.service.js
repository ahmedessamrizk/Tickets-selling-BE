"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const payment_schema_1 = require("./schema/payment.schema");
const mongoose_2 = require("mongoose");
const pagination_service_1 = require("../../common/services/pagination.service");
const tickets_service_1 = require("../tickets/tickets.service");
const payment_enum_1 = require("../../common/enums/payment.enum");
const roles_enum_1 = require("../../common/enums/roles.enum");
const schedule_1 = require("@nestjs/schedule");
let PaymentService = class PaymentService {
    constructor(paymentModel, paginationService, ticketsService) {
        this.paymentModel = paymentModel;
        this.paginationService = paginationService;
        this.ticketsService = ticketsService;
    }
    async create(createPaymentDto, user) {
        const { ticketId, quantity } = createPaymentDto;
        const ticket = await this.ticketsService.findOne({ _id: ticketId });
        if (!ticket || ticket.expiry < new Date()) {
            throw new common_1.NotFoundException('Ticket expired or not found');
        }
        if (ticket.quantity < quantity) {
            throw new common_1.NotFoundException('Not enough tickets available');
        }
        const payment = new this.paymentModel({
            transactionId: new mongoose_2.default.Types.ObjectId().toString(),
            user: user._id,
            ticket: ticketId,
            quantity,
            deposit: ticket.price * quantity,
            status: payment_enum_1.PaymentStatus.Pending,
        });
        return payment.save();
    }
    async findAll(query, user) {
        const filter = user.role === roles_enum_1.Role.User ? { user: user._id } : {};
        const userSelect = user.role === roles_enum_1.Role.User ? 'name' : 'name phoneNumber';
        const ticketSelect = user.role === roles_enum_1.Role.User ? 'name' : 'name quantity';
        const { page, size } = query;
        const { limit, skip } = this.paginationService.paginate(+page, +size);
        const [payments, totalPayments] = await Promise.all([
            this.paymentModel
                .find(filter)
                .limit(limit)
                .skip(skip)
                .populate([
                {
                    path: 'user',
                    select: userSelect,
                },
                {
                    path: 'ticket',
                    select: ticketSelect,
                },
            ])
                .sort({ createdAt: 1 }),
            this.paymentModel.find(filter).countDocuments(),
        ]);
        const totalPages = Math.ceil(totalPayments / limit);
        return { total: totalPayments, totalPages, payments };
    }
    async findOne(id, user) {
        const filter = user.role === roles_enum_1.Role.User
            ? { transactionId: id['transactionId'], user: user._id }
            : { transactionId: id['transactionId'] };
        const ticketSelect = user.role === roles_enum_1.Role.User ? { name: 1 } : { name: 1, quantity: 1 };
        const payment = await this.paymentModel.findOne(filter).populate([
            { path: 'user', select: 'name' },
            { path: 'ticket', select: ticketSelect },
        ]);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async approvePayment(transactionId, user) {
        const payment = await this.findOne(transactionId, user);
        const ticket = await this.ticketsService.findOne({ _id: payment.ticket });
        if (payment.status === payment_enum_1.PaymentStatus.Success) {
            throw new common_1.BadRequestException('Payment is already approved');
        }
        if (ticket.quantity < payment.quantity) {
            throw new common_1.BadRequestException('Ticket quantity is not enough');
        }
        if (new Date() > ticket.expiry) {
            throw new common_1.BadRequestException('Ticket expiry date is reached');
        }
        const updateTicket = this.ticketsService.update(ticket['_id'], {
            quantity: ticket.quantity - payment.quantity,
        });
        payment.status = payment_enum_1.PaymentStatus.Success;
        const updatePayment = await payment.save();
        Object.assign(payment.ticket, {
            quantity: ticket.quantity - payment.quantity,
        });
        await Promise.all([updateTicket, updatePayment]);
        return payment;
    }
    async rejectPayment(transactionId, user) {
        const payment = (await this.findOne(transactionId, user));
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status === payment_enum_1.PaymentStatus.Success) {
            const ticket = await this.ticketsService.update(payment.ticket, {
                quantity: payment.ticket['quantity'] + payment.quantity,
            });
            Object.assign(payment.ticket, {
                quantity: ticket.quantity,
            });
        }
        payment.status = payment_enum_1.PaymentStatus.Fail;
        return payment.save();
    }
    async getUsersForDiscountTicket(ticketId, winners) {
        ticketId = ticketId.toString();
        const users = await this.paymentModel
            .aggregate([
            {
                $addFields: {
                    user: { $toObjectId: '$user' },
                },
            },
            {
                $match: {
                    ticket: ticketId,
                    status: payment_enum_1.PaymentStatus.Success,
                    user: { $nin: winners },
                },
            },
            {
                $group: {
                    _id: '$user',
                    quantity: { $sum: '$quantity' },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            {
                $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true },
            },
            {
                $project: {
                    _id: 0,
                    userDetails: {
                        _id: 1,
                        name: 1,
                        phoneNumber: 1,
                    },
                    quantity: 1,
                },
            },
        ])
            .exec();
        return users;
    }
    async handleExpiredOrOutOfStockPayments() {
        const now = new Date();
        const payments = await this.paymentModel
            .find({
            status: payment_enum_1.PaymentStatus.Pending,
        })
            .populate('ticket');
        const updates = payments.map(async (payment) => {
            const ticket = payment.ticket;
            if (ticket.quantity < payment.quantity || ticket.expiry < now) {
                payment.status = payment_enum_1.PaymentStatus.Fail;
                await payment.save();
            }
        });
        await Promise.all(updates);
    }
    async getUserBuysTicket(order) {
        const result = await this.paymentModel
            .aggregate([
            {
                $addFields: {
                    user: { $toObjectId: '$user' },
                },
            },
            { $match: { status: payment_enum_1.PaymentStatus.Success } },
            {
                $group: {
                    _id: '$user',
                    totalBought: { $sum: '$quantity' },
                },
            },
            { $sort: { totalBought: -1 } },
            { $limit: 1 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    userDetails: {
                        _id: 1,
                        name: 1,
                        phoneNumber: 1,
                    },
                    totalBought: 1,
                },
            },
        ])
            .exec();
        return result;
    }
    async getTicketBought(order, limit = 1, select = { _id: 1, name: 1 }) {
        return this.paymentModel.aggregate([
            { $addFields: { ticket: { $toObjectId: '$ticket' } } },
            { $match: { status: payment_enum_1.PaymentStatus.Success } },
            { $group: { _id: '$ticket', totalSold: { $sum: '$quantity' } } },
            { $sort: { totalSold: order } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'tickets',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'ticket',
                },
            },
            { $unwind: { path: '$ticket', preserveNullAndEmptyArrays: true } },
            { $project: { _id: 0, totalSold: 1, ticket: select } },
        ]);
    }
    async getAnalytics() {
        const [mostActiveUser, mostTicketBought, leastTicketBought] = await Promise.all([
            this.getUserBuysTicket(-1),
            this.getTicketBought(-1),
            this.getTicketBought(1),
        ]);
        return {
            mostActiveUser: mostActiveUser[0],
            mostTicketBought: mostTicketBought[0],
            leastTicketBought: leastTicketBought[0],
        };
    }
};
exports.PaymentService = PaymentService;
__decorate([
    (0, schedule_1.Cron)('0 0 * * * '),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentService.prototype, "handleExpiredOrOutOfStockPayments", null);
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        pagination_service_1.PaginationService,
        tickets_service_1.TicketsService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map