import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';

export class UserDoesntExist extends RecordDoesntExist {
  constructor(id: string) {
    super('User', id);
  }
}
