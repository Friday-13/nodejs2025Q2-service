import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import InvalidCredentials from './errors/invalid-credentials.error';
import { JwtService } from '@nestjs/jwt';
import { ResponseLoginDto } from './dto/login-response.dto';
import LoginAlreadyExists from 'src/users/errors/login-already-exists.error';
import { ResponseSignupDto } from './dto/signup-response.dto';
import * as bcrypt from 'bcrypt';
import { IBaseTokenPayload } from './token.interface';
import { RefreshDto } from './dto/refresh.dto';

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
    const accessPayload: IBaseTokenPayload = {
      userId: user.id,
      login: user.login,
    };
    const refreshPayload: IBaseTokenPayload = {
      userId: user.id,
      login: user.login,
    };
    return {
      accessToken: await this.jwtService.signAsync(accessPayload),
      refreshToken: await this.jwtService.signAsync(refreshPayload, {
        //TODO: load this from env
        expiresIn: '24h',
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

  async refresh(refreshDto: RefreshDto) {
    const token = refreshDto.refreshToken;
    if (!token) {
      throw new InvalidCredentials();
    }
    const payload = (await this.jwtService.verifyAsync(
      token,
    )) as IBaseTokenPayload;

    const user = await this.userService.getById(payload.userId);

    const accessPayload: IBaseTokenPayload = {
      userId: user.id,
      login: user.login,
    };
    const refreshPayload: IBaseTokenPayload = {
      userId: user.id,
      login: user.login,
    };

    return {
      accessToken: await this.jwtService.signAsync(accessPayload),
      refreshToken: await this.jwtService.signAsync(refreshPayload, {
        //TODO: load this from env
        expiresIn: '24h',
      }),
    };
  }
}
