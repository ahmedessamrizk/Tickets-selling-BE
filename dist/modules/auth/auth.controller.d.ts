import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninDto } from './dtos/signin-dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(body: CreateUserDto): Promise<void>;
    signin(res: Response, body: SigninDto): Promise<void>;
    createAdmin(body: CreateUserDto): Promise<void>;
}
