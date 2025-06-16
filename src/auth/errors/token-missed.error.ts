import InvalidCredentials from './invalid-credentials.error';
const defaultMessage = 'Token required';

export default class TokenMissed extends InvalidCredentials {
  constructor(msg: string = defaultMessage) {
    super(msg);
  }
}
