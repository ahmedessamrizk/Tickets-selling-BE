import { CreateUserDto } from './dtos/create-user.dto';
import { EncryptionService } from '../../common/services/encryption.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SigninDto } from './dtos/signin-dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly usersService;
    private readonly encryptionService;
    private readonly configService;
    private readonly jwtService;
    constructor(usersService: UsersService, encryptionService: EncryptionService, configService: ConfigService, jwtService: JwtService);
    signup(createUserDto: Partial<CreateUserDto>): Promise<void>;
    signin(signinDto: SigninDto): Promise<string>;
    private hashPassword;
    createAdmin(createUserDto: Partial<CreateUserDto>): Promise<void>;
}
