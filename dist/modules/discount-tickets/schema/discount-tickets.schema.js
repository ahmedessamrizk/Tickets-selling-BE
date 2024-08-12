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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountTicketSchema = exports.DiscountTicket = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tickets_schema_1 = require("../../tickets/schema/tickets.schema");
let DiscountTicket = class DiscountTicket {
};
exports.DiscountTicket = DiscountTicket;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DiscountTicket.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DiscountTicket.prototype, "desc", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1, min: 1 }),
    __metadata("design:type", Number)
], DiscountTicket.prototype, "limit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], DiscountTicket.prototype, "used", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], DiscountTicket.prototype, "expiry", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
        unique: true,
    }),
    __metadata("design:type", tickets_schema_1.Ticket)
], DiscountTicket.prototype, "ticket", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    }),
    __metadata("design:type", mongoose_2.Types.Array)
], DiscountTicket.prototype, "winners", void 0);
exports.DiscountTicket = DiscountTicket = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DiscountTicket);
const DiscountTicketSchema = mongoose_1.SchemaFactory.createForClass(DiscountTicket);
exports.DiscountTicketSchema = DiscountTicketSchema;
//# sourceMappingURL=discount-tickets.schema.js.map