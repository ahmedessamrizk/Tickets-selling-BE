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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const users_schema_1 = require("./schema/users.schema");
const mongoose_2 = require("mongoose");
const roles_enum_1 = require("../../common/enums/roles.enum");
const pagination_service_1 = require("../../common/services/pagination.service");
let UsersService = class UsersService {
    constructor(userModel, paginationService) {
        this.userModel = userModel;
        this.paginationService = paginationService;
    }
    async create(user) {
        await this.userModel.create(user);
    }
    async findOne(query) {
        return this.userModel.findOne(query);
    }
    async getProfile(id) {
        return this.userModel.findById(id);
    }
    async findAll(query) {
        const { page, size, role, isBlocked, sortBy, sortOrder } = query;
        const filter = {};
        const sort = {};
        if (role) {
            filter['role'] = role;
        }
        if (isBlocked) {
            filter['isBlocked'] = isBlocked;
        }
        if (sortBy) {
            sort[sortBy] = sortOrder ? +sortOrder : 1;
        }
        else {
            sort['role'] = 1;
            sort['isBlocked'] = -1;
        }
        const { limit, skip } = this.paginationService.paginate(+page, +size);
        const [users, totalUsers] = await Promise.all([
            this.userModel
                .find(filter)
                .limit(limit)
                .skip(skip)
                .select('-password -__v')
                .sort(sort),
            this.userModel.find(filter).countDocuments(),
        ]);
        const totalPages = Math.ceil(totalUsers / limit);
        return { total: totalUsers, totalPages, users };
    }
    async updateProfile(userId, updateUserDto) {
        const user = await this.findOne({ phoneNumber: updateUserDto.phoneNumber });
        if (user) {
            throw new common_1.BadRequestException('Phone number already taken');
        }
        return this.userModel.findByIdAndUpdate(userId, updateUserDto, {
            new: true,
        });
    }
    async blockUser(id, isBlocked) {
        const user = await this.getProfile(id);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.role === roles_enum_1.Role.SuperAdmin) {
            throw new common_1.BadRequestException('You cannot block a super admin');
        }
        await this.userModel.findByIdAndUpdate(id, { isBlocked });
    }
    async updateRole(id, role) {
        const user = await this.getProfile(id);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.role === roles_enum_1.Role.SuperAdmin || role === roles_enum_1.Role.SuperAdmin) {
            throw new common_1.BadRequestException('you cannot change role of super admin');
        }
        return await this.userModel.findByIdAndUpdate(id, { role }, { new: true });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        pagination_service_1.PaginationService])
], UsersService);
//# sourceMappingURL=users.service.js.map