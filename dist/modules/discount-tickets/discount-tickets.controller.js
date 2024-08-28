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
exports.DiscountTicketsController = void 0;
const common_1 = require("@nestjs/common");
const create_discount_tickets_dto_1 = require("./dtos/create-discount-tickets.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const roles_guard_1 = require("../../common/guards/roles.guard");
const discount_tickets_service_1 = require("./discount-tickets.service");
const serialize_interceptor_1 = require("../../common/interceptors/serialize.interceptor");
const discount_ticket_dto_1 = require("./dtos/discount-ticket.dto");
const update_discount_task_dto_1 = require("./dtos/update-discount-task.dto");
const get_discount_tickets_dto_1 = require("./dtos/get-discount-tickets.dto");
let DiscountTicketsController = class DiscountTicketsController {
    constructor(discountTicketsService) {
        this.discountTicketsService = discountTicketsService;
    }
    createDiscountTicket(body) {
        return this.discountTicketsService.create(body);
    }
    getDiscountTickets(query) {
        return this.discountTicketsService.findAll(query);
    }
    getDiscountTicketsWinners(id) {
        return this.discountTicketsService.getWinners(id);
    }
    getDiscountTicket(id) {
        return this.discountTicketsService.findById(id);
    }
    updateDiscountTicket(body, id) {
        return this.discountTicketsService.update(id, body);
    }
    deleteDiscountTicket(id) {
        return this.discountTicketsService.delete(id);
    }
    addWinner(id, userId) {
        return this.discountTicketsService.addWinner(id, userId);
    }
};
exports.DiscountTicketsController = DiscountTicketsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.SuperAdmin),
    (0, serialize_interceptor_1.Serialize)(discount_ticket_dto_1.DiscountTicketDto),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_discount_tickets_dto_1.CreateDiscountTicketDto]),
    __metadata("design:returntype", Promise)
], DiscountTicketsController.prototype, "createDiscountTicket", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.SuperAdmin),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_discount_tickets_dto_1.GetDiscountTicketsDto]),
    __metadata("design:returntype", Promise)
], DiscountTicketsController.prototype, "getDiscountTickets", null);
__decorate([
    (0, common_1.Get)('/:id/winners'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.SuperAdmin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscountTicketsController.prototype, "getDiscountTicketsWinners", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.SuperAdmin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscountTicketsController.prototype, "getDiscountTicket", null);
__decorate([
    (0, common_1.Patch)('/:id'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.SuperAdmin),
    (0, serialize_interceptor_1.Serialize)(discount_ticket_dto_1.DiscountTicketDto),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_discount_task_dto_1.UpdateDiscountTaskDto, String]),
    __metadata("design:returntype", Promise)
], DiscountTicketsController.prototype, "updateDiscountTicket", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.SuperAdmin),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscountTicketsController.prototype, "deleteDiscountTicket", null);
__decorate([
    (0, common_1.Post)('/:id/winners/:userId'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.SuperAdmin),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DiscountTicketsController.prototype, "addWinner", null);
exports.DiscountTicketsController = DiscountTicketsController = __decorate([
    (0, common_1.Controller)('/discount-tickets'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [discount_tickets_service_1.DiscountTicketsService])
], DiscountTicketsController);
//# sourceMappingURL=discount-tickets.controller.js.map