import RecordAlreadyExists from 'src/errors/record-already-exists.error';

export default class LoginAlreadyExists extends RecordAlreadyExists {
  constructor(login: string) {
    super('User', login, 'login');
  }
}
