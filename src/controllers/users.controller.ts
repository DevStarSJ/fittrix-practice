import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { SignUpInput } from 'src/types/sign-up.input';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signIn')
  async login(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('signUp')
  async signUp(@Body() body: SignUpInput) {
    console.log(body);
    return this.authService.signUp(body);
  }
}
