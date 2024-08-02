import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninDto } from './dtos/signin-dto';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @HttpCode(200)
  @Post('/signin')
  async signin(@Res() res: Response, @Body() body: SigninDto) {
    const token = await this.authService.signin(body);
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    res.json({ message: 'successful', statusCode: 200 });
  }
}
