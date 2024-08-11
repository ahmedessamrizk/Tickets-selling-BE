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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const users_schema_1 = require("./schema/users.schema");
const serialize_interceptor_1 = require("../../common/interceptors/serialize.interceptor");
const user_dto_1 = require("./dtos/user.dto");
const users_service_1 = require("./users.service");
const roles_enum_1 = require("../../common/enums/roles.enum");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const update_user_dto_1 = require("./dtos/update-user.dto");
const find_users_dto_1 = require("./dtos/find-users.dto");
const update_role_dto_1 = require("./dtos/update-role.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    getProfile(user) {
        return this.usersService.getProfile(user._id);
    }
    logout(res) {
        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        return res.json({ message: 'Logged out successfully' });
    }
    getUsers() {
        return this.usersService.findAll();
    }
    updateProfile(user, updateUserDto) {
        return this.usersService.updateProfile(user._id, updateUserDto);
    }
    blockUser(id) {
        return this.usersService.blockUser(id, true);
    }
    unblockUser(id) {
        return this.usersService.blockUser(id, false);
    }
    changeRole(id, role) {
        return this.usersService.updateRole(id, role.role);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('/profile'),
    (0, serialize_interceptor_1.Serialize)(user_dto_1.UserDto),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_schema_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('/logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SuperAdmin),
    (0, serialize_interceptor_1.Serialize)(find_users_dto_1.GetUsersDto),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Patch)('/profile'),
    (0, serialize_interceptor_1.Serialize)(user_dto_1.UserDto),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_schema_1.User,
        update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('/:id/block'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SuperAdmin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Patch)('/:id/unblock'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SuperAdmin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "unblockUser", null);
__decorate([
    (0, common_1.Patch)('/:id/role'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SuperAdmin),
    (0, serialize_interceptor_1.Serialize)(find_users_dto_1.GetUsersDto),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeRole", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map