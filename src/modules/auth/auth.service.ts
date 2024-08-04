import * as bcrypt from 'bcrypt';
import { User } from '../users/schema/users.schema';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { EncryptionService } from 'src/common/services/encryption.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SigninDto } from './dtos/signin-dto';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly encryptionService: EncryptionService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: Partial<CreateUserDto>): Promise<void> {
    const { name, nationalId, phoneNumber, password } = createUserDto;

    //check if user already exists
    const user = await this.usersService.findOne({
      phoneNumber,
    });

    if (user) {
      throw new ConflictException('user already exists');
    }

    //encrypt nationalId
    const encryptedNationalId = this.encryptionService.encrypt(nationalId);

    //hash password
    const hashedPassword = await this.hashPassword(password);
    Object.assign(createUserDto, {
      password: hashedPassword,
      nationalId: encryptedNationalId,
    });

    return this.usersService.create(createUserDto);
  }

  async signin(signinDto: SigninDto): Promise<string> {
    const { phoneNumber, password } = signinDto;

    //check if email and password are correct.
    const user = await this.usersService.findOne({ phoneNumber });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('invalid credentials');
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('this account is blocked');
    }

    //generate token
    const payload: JwtPayload = {
      sub: user['_id'],
      name: user.name,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<string>('SALT_ROUNDS');
    return bcrypt.hash(password, Number(saltRounds));
  }

  async createAdmin(createUserDto: Partial<CreateUserDto>): Promise<void> {
    Object.assign(createUserDto, { role: Role.Admin });
    return this.signup(createUserDto);
  }
}
