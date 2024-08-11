import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from '../users/users.service';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(payload: JwtPayload): Promise<{
        _id: string;
        name: string;
        role: string;
    }>;
}
export {};
