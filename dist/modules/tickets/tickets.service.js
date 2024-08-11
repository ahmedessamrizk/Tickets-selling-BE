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
let TicketsService = class TicketsService {
    constructor(ticketModel) {
        this.ticketModel = ticketModel;
    }
    async create(createTicketDto, user) {
        await this.checkValid(createTicketDto);
        Object.assign(createTicketDto, { createdBy: user._id });
        return this.ticketModel.create(createTicketDto);
    }
    findOne(query) {
        return this.ticketModel.findOne(query);
    }
    async checkValid(createTicketDto, id = '') {
        const ticket = await this.findOne({ name: createTicketDto.name });
        if (ticket) {
            if (id !== ticket['_id'].toString()) {
                throw new common_1.ConflictException('Ticket with this name already exists');
            }
        }
    }
    async findAll(user) {
        let expose = {};
        if (!user || user.role === roles_enum_1.Role.User) {
            expose = { quantity: 0, createdBy: 0 };
        }
        const tickets = await this.ticketModel
            .find()
            .populate([
            {
                path: 'createdBy',
                select: 'name',
            },
        ])
            .select(expose);
        return tickets;
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
        const ticket = await this.ticketModel.findByIdAndDelete(id);
        if (!ticket) {
            throw new common_1.ConflictException('Ticket not found');
        }
        return null;
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(tickets_schema_1.Ticket.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map