export default class InvalidCredentials extends Error {
  constructor(credential: string) {
    super(`${credential} is invalid`);
  }
}
