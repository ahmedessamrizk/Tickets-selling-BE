import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // Extract JWT from cookies
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.accessToken,
      ]),
      ignoreExpiration: false, // Do not ignore expired tokens
      secretOrKey: configService.get<string>('TOKEN_KEY'),
    });
  }

  async validate(payload: JwtPayload) {
    // Validate and return user data
    const user = await this.usersService.findOne({ _id: payload.sub });

    if (user?.isBlocked) {
      throw new UnauthorizedException('this account is blocked');
    }

    return { _id: payload.sub, name: payload.name, role: payload.role };
  }
}
