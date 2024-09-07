import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninDto } from './dtos/signin-dto';
import { Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Public()
  @HttpCode(200)
  @Post('/signin')
  async signin(@Res() res: Response, @Body() body: SigninDto) {
    const { token, user } = await this.authService.signin(body);
    res.cookie('accessToken', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.json({ message: 'successful', statusCode: 200, user: user });
  }

  @Post('/admin')
  @Roles(Role.SuperAdmin)
  @UseGuards(RolesGuard)
  async createAdmin(@Body() body: CreateUserDto) {
    return this.authService.createAdmin(body);
  }
}
