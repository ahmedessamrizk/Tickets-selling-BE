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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const tickets_schema_1 = require("./schema/tickets.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const roles_enum_1 = require("../../common/enums/roles.enum");
const discount_tickets_schema_1 = require("../discount-tickets/schema/discount-tickets.schema");
const pagination_service_1 = require("../../common/services/pagination.service");
const payment_schema_1 = require("../payment/schema/payment.schema");
const payment_enum_1 = require("../../common/enums/payment.enum");
let TicketsService = class TicketsService {
    constructor(ticketModel, discountTicketModel, paymentModel, paginationService) {
        this.ticketModel = ticketModel;
        this.discountTicketModel = discountTicketModel;
        this.paymentModel = paymentModel;
        this.paginationService = paginationService;
    }
    async create(createTicketDto, user) {
        await this.checkValid(createTicketDto);
        Object.assign(createTicketDto, { createdBy: user._id });
        return this.ticketModel.create(createTicketDto);
    }
    findOne(query, select = '') {
        return this.ticketModel.findOne(query).select(select);
    }
    async checkValid(createTicketDto, id = '') {
        const ticket = await this.findOne({ name: createTicketDto.name });
        if (ticket) {
            if (id !== ticket['_id'].toString()) {
                throw new common_1.ConflictException('Ticket with this name already exists');
            }
        }
    }
    async findAll(query, user) {
        let expose = {}, filter = {}, sort = {};
        if (!user || user.role === roles_enum_1.Role.User) {
            expose = { quantity: 0, createdBy: 0 };
            filter = { quantity: { $gt: 0 } };
        }
        if (query.sortBy) {
            sort[query['sortBy']] = Number(query.sortOrder) || -1;
        }
        else {
            sort = { createdAt: -1 };
        }
        const { page, size } = query;
        const { limit, skip } = this.paginationService.paginate(+page, +size);
        const [tickets, totalTickets] = await Promise.all([
            this.ticketModel
                .find(filter)
                .limit(limit)
                .skip(skip)
                .populate([
                {
                    path: 'createdBy',
                    select: 'name',
                },
            ])
                .select(expose)
                .sort(sort),
            this.ticketModel.find(filter).countDocuments(),
        ]);
        const totalPages = Math.ceil(totalTickets / limit);
        return { total: totalTickets, totalPages, tickets };
    }
    async getTicketsForDiscountTickets() {
        const discountTicketIds = await this.discountTicketModel.distinct('ticket');
        const ticketsWithoutDiscount = await this.ticketModel
            .find({
            _id: { $nin: discountTicketIds },
        })
            .select('name');
        return ticketsWithoutDiscount;
    }
    async update(id, updateTicketDto) {
        if (updateTicketDto.name) {
            await this.checkValid(updateTicketDto, id);
        }
        const updatedTicket = await this.ticketModel.findByIdAndUpdate(id, updateTicketDto, { new: true });
        if (!updatedTicket) {
            throw new common_1.ConflictException('Ticket not found');
        }
        return updatedTicket;
    }
    async delete(id) {
        const ticket = await this.ticketModel.findById(id);
        if (!ticket) {
            throw new common_1.ConflictException('Ticket not found');
        }
        if (ticket.expiry > new Date()) {
            const payment = await this.paymentModel.findOne({
                ticket: id,
                status: { $in: [payment_enum_1.PaymentStatus.Pending, payment_enum_1.PaymentStatus.Success] },
            });
            if (payment) {
                throw new common_1.BadRequestException('Ticket is used in payment');
            }
        }
        const discountTicket = await this.discountTicketModel
            .findOne({
            ticket: id,
        })
            .populate('ticket');
        if (discountTicket) {
            throw new common_1.BadRequestException('Ticket has spin wheel');
        }
        await this.ticketModel.deleteOne({ _id: id });
        return null;
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(tickets_schema_1.Ticket.name)),
    __param(1, (0, mongoose_2.InjectModel)(discount_tickets_schema_1.DiscountTicket.name)),
    __param(2, (0, mongoose_2.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        pagination_service_1.PaginationService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map