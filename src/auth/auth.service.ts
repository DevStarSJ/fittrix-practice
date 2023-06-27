import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { SignUpInput } from 'src/types/sign-up.input';
import * as bcrypt from 'bcrypt';
import environments from 'src/environments';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(input: SignUpInput) {
    if (input.password != input.passwordConfirm)
      throw new UnauthorizedException("password and passwordConfirm is not matched");

    const password = await bcrypt.hash(input.password, environments.salt);
    const user = User.create({
      email: input.email,
      password: input.password,
      role: input.role
    });
    await user.save();
    return user;
  }
}