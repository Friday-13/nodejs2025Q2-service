import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import InvalidCredentials from './errors/invalid-credentials.error';
import { JwtService } from '@nestjs/jwt';
import { ResponseLoginDto } from './dto/login-response.dto';
import LoginAlreadyExists from 'src/users/errors/login-already-exists.error';
import { ResponseSignupDto } from './dto/signup-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(login: string, password: string): Promise<ResponseLoginDto> {
    const user = await this.userService.getByLogin(login);
    const isPasswordsMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordsMatch) {
      throw new InvalidCredentials();
    }
    const payload = { userId: user.id, login: user.login };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async signup(login: string, password: string): Promise<ResponseSignupDto> {
    try {
      const user = await this.userService.create({ login, password });
      return { id: user.id };
    } catch (err) {
      if (err instanceof LoginAlreadyExists) {
        throw new InvalidCredentials(err.message);
      }
      throw err;
    }
  }
}
