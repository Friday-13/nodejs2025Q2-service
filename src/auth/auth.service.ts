import { Injectable, Req } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import InvalidCredentials from './errors/invalid-credentials.error';
import { JwtService } from '@nestjs/jwt';
import { ResponseLoginDto } from './dto/login-response.dto';
import LoginAlreadyExists from 'src/users/errors/login-already-exists.error';
import { ResponseSignupDto } from './dto/signup-response.dto';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { IAccessTokenPayload, IBaseTokenPayload, IRefreshTokenPayload } from './token.interface';

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
    const accessPayload: IAccessTokenPayload = {
      userId: user.id,
      login: user.login,
      tokenType: 'access_token',
    };
    const refreshPayload: IRefreshTokenPayload = {
      userId: user.id,
      tokenType: 'refresh_token',
    };
    return {
      accessToken: await this.jwtService.signAsync(accessPayload),
      refreshToken: await this.jwtService.signAsync(refreshPayload, {
        //TODO: load this from env
        expiresIn: '1m',
      }),
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

  async refresh(@Req() request: Request) {
    const [type, token] = request.headers.authorization.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new InvalidCredentials();
    }
    const payload = this.jwtService.decode(token) as IBaseTokenPayload;
    if (payload.tokenType !== 'refresh_token') {
      throw new InvalidCredentials();
    }

    const user = await this.userService.getById(payload.userId);

    const accessPayload: IAccessTokenPayload = {
      userId: user.id,
      login: user.login,
      tokenType: 'access_token',
    };
    const refreshPayload: IRefreshTokenPayload = {
      userId: user.id,
      tokenType: 'refresh_token',
    };

    return {
      accessToken: await this.jwtService.signAsync(accessPayload),
      refreshToken: await this.jwtService.signAsync(refreshPayload, {
        //TODO: load this from env
        expiresIn: '1m',
      }),
    };
  }
}
