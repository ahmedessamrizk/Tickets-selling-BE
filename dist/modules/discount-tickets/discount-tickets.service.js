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
exports.DiscountTicketsService = void 0;
const common_1 = require("@nestjs/common");
const create_discount_tickets_dto_1 = require("./dtos/create-discount-tickets.dto");
const discount_tickets_schema_1 = require("./schema/discount-tickets.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tickets_service_1 = require("../tickets/tickets.service");
const pagination_service_1 = require("../../common/services/pagination.service");
let DiscountTicketsService = class DiscountTicketsService {
    constructor(discountTicketModel, ticketsService, paginationService) {
        this.discountTicketModel = discountTicketModel;
        this.ticketsService = ticketsService;
        this.paginationService = paginationService;
        this.populate = [
            {
                path: 'ticket',
                select: 'name',
            },
            {
                path: 'winners',
                select: 'name phoneNumber',
            },
        ];
    }
    findOne(query) {
        return this.discountTicketModel.findOne(query);
    }
    async create(createDiscountTicketDto) {
        const checkTicket = await this.checkValidTicket(createDiscountTicketDto.ticket);
        let createdDiscountTicket = await this.discountTicketModel.create(createDiscountTicketDto);
        return {
            ...createdDiscountTicket.toObject(),
            ticket: {
                ...checkTicket['_doc'],
            },
        };
    }
    async checkValidTicket(ticket) {
        const checkTicket = await this.ticketsService.findOne({ _id: ticket }, 'name expiry');
        if (!checkTicket) {
            throw new common_1.NotFoundException('The provided ticket does not exist');
        }
        if (checkTicket.expiry < new Date()) {
            throw new common_1.ConflictException('The provided ticket has expired');
        }
        const discountTicket = await this.findOne({
            ticket: ticket,
        });
        if (discountTicket) {
            throw new common_1.ConflictException('The provided ticket already has a discount ticket');
        }
        return checkTicket;
    }
    async findAll(query) {
        const { page, size } = query;
        const { limit, skip } = this.paginationService.paginate(+page, +size);
        const [discountTickets, totalDiscountTickets] = await Promise.all([
            this.discountTicketModel
                .find()
                .limit(limit)
                .skip(skip)
                .populate(this.populate),
            this.discountTicketModel.find().countDocuments(),
        ]);
        const totalPages = Math.ceil(totalDiscountTickets / limit);
        return { total: totalDiscountTickets, totalPages, discountTickets };
    }
    async findById(id) {
        return this.discountTicketModel.findById(id).populate(this.populate);
    }
    async update(id, updateDiscountTaskDto) {
        if (updateDiscountTaskDto.ticket) {
            await this.checkValidTicket(updateDiscountTaskDto.ticket);
        }
        const updateDiscountTicket = await this.discountTicketModel.findByIdAndUpdate(id, updateDiscountTaskDto, {
            new: true,
        });
        if (!updateDiscountTicket) {
            throw new common_1.NotFoundException('Discount ticket not found');
        }
        return updateDiscountTicket;
    }
    async delete(id) {
        const deleteDiscountTicket = await this.discountTicketModel.findByIdAndDelete(id);
        if (!deleteDiscountTicket) {
            throw new common_1.NotFoundException('Discount ticket not found');
        }
        return null;
    }
};
exports.DiscountTicketsService = DiscountTicketsService;
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_discount_tickets_dto_1.CreateDiscountTicketDto]),
    __metadata("design:returntype", Promise)
], DiscountTicketsService.prototype, "create", null);
exports.DiscountTicketsService = DiscountTicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(discount_tickets_schema_1.DiscountTicket.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        tickets_service_1.TicketsService,
        pagination_service_1.PaginationService])
], DiscountTicketsService);
//# sourceMappingURL=discount-tickets.service.js.map