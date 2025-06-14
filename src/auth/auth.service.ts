import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import InvalidCredentials from './errors/invalid-credentials.error';
import { JwtService } from '@nestjs/jwt';
import { ResponseLoginDto } from './dto/login-response.dto';
import LoginAlreadyExists from 'src/users/errors/login-already-exists.error';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(login: string, password: string): Promise<ResponseLoginDto> {
    const user = await this.userService.getByLogin(login);
    if (user.password !== password) {
      throw new InvalidCredentials();
    }
    const payload = { sub: user.id, login: user.login };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signup(login: string, password: string): Promise<ResponseLoginDto> {
    try {
      await this.userService.create({ login, password });
      return await this.login(login, password);
    } catch (err) {
      if (err instanceof LoginAlreadyExists) {
        throw new InvalidCredentials(err.message);
      }
      throw err;
    }
  }
}
