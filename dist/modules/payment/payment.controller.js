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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const create_payment_dto_1 = require("./dtos/create-payment.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const payment_service_1 = require("./payment.service");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const get_tickets_dto_1 = require("./dtos/get-tickets.dto");
const users_schema_1 = require("../users/schema/users.schema");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    createPayment(createPaymentDto, user) {
        return this.paymentService.create(createPaymentDto, user);
    }
    getPayments(query, user) {
        return this.paymentService.findAll(query, user);
    }
    getAnalytics() {
        return this.paymentService.getAnalytics();
    }
    getMostSoldTickets(query) {
        const quantity = query.quantity ? Number(query.quantity) : 5;
        return this.paymentService.getTicketBought(-1, quantity, {
            _id: 1,
            name: 1,
            price: 1,
            desc: 1,
            ImageURL: 1,
        });
    }
    getPayment(transactionId, user) {
        return this.paymentService.findOne(transactionId, user);
    }
    approvePayment(transactionId, user) {
        return this.paymentService.approvePayment(transactionId, user);
    }
    rejectPayment(transactionId, user) {
        return this.paymentService.rejectPayment(transactionId, user);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.User),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto,
        users_schema_1.User]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_tickets_dto_1.GetPaymentsDto,
        users_schema_1.User]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Get)('/analytics'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.SuperAdmin),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('/most-sold'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.User, roles_enum_1.Role.Admin, roles_enum_1.Role.SuperAdmin),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getMostSoldTickets", null);
__decorate([
    (0, common_1.Get)('/:transactionId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_schema_1.User]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPayment", null);
__decorate([
    (0, common_1.Post)('/:transactionId/approve'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.SuperAdmin),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_schema_1.User]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "approvePayment", null);
__decorate([
    (0, common_1.Post)('/:transactionId/reject'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.SuperAdmin),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_schema_1.User]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "rejectPayment", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('/payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map