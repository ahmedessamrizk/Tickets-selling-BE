"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountTicketsModule = void 0;
const common_1 = require("@nestjs/common");
const discount_tickets_controller_1 = require("./discount-tickets.controller");
const discount_tickets_service_1 = require("./discount-tickets.service");
let DiscountTicketsModule = class DiscountTicketsModule {
};
exports.DiscountTicketsModule = DiscountTicketsModule;
exports.DiscountTicketsModule = DiscountTicketsModule = __decorate([
    (0, common_1.Module)({
        controllers: [discount_tickets_controller_1.DiscountTicketsController],
        providers: [discount_tickets_service_1.DiscountTicketsService]
    })
], DiscountTicketsModule);
//# sourceMappingURL=discount-tickets.module.js.map