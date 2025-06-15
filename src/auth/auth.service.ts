import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import InvalidCredentials from './errors/invalid-credentials.error';
import { ResponseLoginDto } from './dto/login-response.dto';
import LoginAlreadyExists from 'src/users/errors/login-already-exists.error';
import { ResponseSignupDto } from './dto/signup-response.dto';
import * as bcrypt from 'bcrypt';
import { RefreshDto } from './dto/refresh.dto';
import { TokenService } from './token.service';
import TokenMissed from './errors/token-missed.error';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {}
  async login(login: string, password: string): Promise<ResponseLoginDto> {
    const user = await this.userService.getByLogin(login);
    const isPasswordsMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordsMatch) {
      throw new InvalidCredentials();
    }
    const payload = this.tokenService.generatePayload(user);
    return {
      accessToken: await this.tokenService.getAccessToken(payload),
      refreshToken: await this.tokenService.getRefreshToken(payload),
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

  async refresh(refreshDto: RefreshDto) {
    const token = refreshDto.refreshToken;
    if (!token) {
      throw new TokenMissed();
    }
    const payload = await this.tokenService.verify(token);

    const user = await this.userService.getById(payload.userId);
    const freshPayload = this.tokenService.generatePayload(user);

    return {
      accessToken: await this.tokenService.getAccessToken(freshPayload),
      refreshToken: await this.tokenService.getRefreshToken(freshPayload),
    };
  }
}
