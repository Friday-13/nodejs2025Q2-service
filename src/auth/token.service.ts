import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IBaseTokenPayload } from './token.interface';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TokenService {
  private accessTokenExp: string;
  private refreshTokenExp: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.accessTokenExp = this.configService.get('TOKEN_EXPIRE_TIME') || '1h';
    this.refreshTokenExp =
      this.configService.get('TOKEN_REFRESH_EXPIRE_TIME') || '24h';
  }

  async getAccessToken(payload: IBaseTokenPayload) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.accessTokenExp,
    });
  }
  async getRefreshToken(payload: IBaseTokenPayload) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.refreshTokenExp,
    });
  }

  generatePayload(user: User) {
    return {
      userId: user.id,
      login: user.login,
    };
  }

  async verify(token: string) {
    const payload = (await this.jwtService.verifyAsync(
      token,
    )) as IBaseTokenPayload;
    return payload;
  }
}
