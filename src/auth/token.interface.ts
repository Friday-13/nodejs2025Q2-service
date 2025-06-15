type TTokenType = 'access_token' | 'refresh_token';

export interface IBaseTokenPayload {
  userId: string;
  tokenType: TTokenType;
  exp?: number;
}

export interface IAccessTokenPayload extends IBaseTokenPayload {
  login: string;
  tokenType: 'access_token';
}

export interface IRefreshTokenPayload extends IBaseTokenPayload {
  tokenType: 'refresh_token';
}
