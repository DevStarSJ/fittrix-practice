import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { SignInInput } from 'src/types/sign-in.input';
import { SignUpInput } from 'src/types/sign-up.input';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Post('signIn')
  async signIn(@Body() body: SignInInput) {
    const token = await this.authService.signIn(body);
    return this.signInOrUpResponse(token);
  }

  @Post('signUp')
  async signUp(@Body() body: SignUpInput) {
    const user = await this.authService.signUp(body);
    const token = this.authService.getToken(user);
    return this.signInOrUpResponse(token);

  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }



  private signInOrUpResponse(token) {
    return {
      success: true,
      authToken: token
    }
  }
}
