import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import InvalidCredentials from './errors/invalid-credentials.error';
import { JwtService } from '@nestjs/jwt';
import { ResponseLoginDto } from './dto/login-response.dto';

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
}
