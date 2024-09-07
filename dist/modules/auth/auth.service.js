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
exports.AuthService = void 0;
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const encryption_service_1 = require("../../common/services/encryption.service");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const roles_enum_1 = require("../../common/enums/roles.enum");
let AuthService = class AuthService {
    constructor(usersService, encryptionService, configService, jwtService) {
        this.usersService = usersService;
        this.encryptionService = encryptionService;
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async signup(createUserDto) {
        const { name, nationalId, phoneNumber, password } = createUserDto;
        const user = await this.usersService.findOne({
            phoneNumber,
        });
        if (user) {
            throw new common_1.ConflictException('User already exists');
        }
        const encryptedNationalId = this.encryptionService.encrypt(nationalId);
        const hashedPassword = await this.hashPassword(password);
        Object.assign(createUserDto, {
            password: hashedPassword,
            nationalId: encryptedNationalId,
        });
        return this.usersService.create(createUserDto);
    }
    async signin(signinDto) {
        const { phoneNumber, password } = signinDto;
        const user = await this.usersService.findOne({ phoneNumber });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.isBlocked) {
            throw new common_1.UnauthorizedException('This account is blocked');
        }
        const payload = {
            sub: user['_id'],
            name: user.name,
            role: user.role,
        };
        const token = this.jwtService.sign(payload);
        return { user: { _id: user._id, name: user.name, role: user.role }, token };
    }
    async hashPassword(password) {
        const saltRounds = this.configService.get('SALT_ROUNDS');
        return bcrypt.hash(password, Number(saltRounds));
    }
    async createAdmin(createUserDto) {
        Object.assign(createUserDto, { role: roles_enum_1.Role.Admin });
        return this.signup(createUserDto);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        encryption_service_1.EncryptionService,
        config_1.ConfigService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map