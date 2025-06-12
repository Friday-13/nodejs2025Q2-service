const defaultMessage = 'Incorrect login or password';
export default class InvalidCredentials extends Error {
  constructor(msg: string = defaultMessage) {
    super(msg);
  }
}
