import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { SignUpInput } from 'src/types/sign-up.input';
import * as bcrypt from 'bcrypt';
import environments from 'src/environments';
import { SignInInput } from 'src/types/sign-in.input';

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

  async signIn(input: SignInInput) {
    const user = await User.findOne({where: {email: input.email}});
    if (!user)
      throw new UnauthorizedException("wrong password or email");
    
    const hashedPassword = await bcrypt.hash(input.password, environments.salt);
    if (user.password != hashedPassword)
      throw new UnauthorizedException("wrong password or email");
    
    return this.getToken(user);
  }

  getToken(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }

  async signUp(input: SignUpInput) {
    if (input.password != input.passwordConfirm)
      throw new UnauthorizedException("password and passwordConfirm is not matched");
    
    const existedUser = await User.findOne({where: {email: input.email}});
    if (existedUser)
      throw new UnauthorizedException("A user with that email already exists.");

    const password = await bcrypt.hash(input.password, environments.salt);
    const user = User.create({
      email: input.email,
      password: password,
      role: input.role
    });
    return await user.save();
  }
}