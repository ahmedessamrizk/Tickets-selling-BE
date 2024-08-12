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
exports.TicketSchema = exports.Ticket = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_schema_1 = require("../../../modules/users/schema/users.schema");
let Ticket = class Ticket {
};
exports.Ticket = Ticket;
__decorate([
    (0, mongoose_1.Prop)({ required: true, minlength: 2, unique: true }),
    __metadata("design:type", String)
], Ticket.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Ticket.prototype, "desc", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], Ticket.prototype, "ImageURL", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 5 }),
    __metadata("design:type", Number)
], Ticket.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], Ticket.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Ticket.prototype, "expiry", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", users_schema_1.User)
], Ticket.prototype, "createdBy", void 0);
exports.Ticket = Ticket = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Ticket);
const TicketSchema = mongoose_1.SchemaFactory.createForClass(Ticket);
exports.TicketSchema = TicketSchema;
//# sourceMappingURL=tickets.schema.js.map