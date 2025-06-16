import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';

export class UserDoesntExist extends RecordDoesntExist {
  constructor(fieldValue: string, fieldName?: string) {
    super('User', fieldValue, fieldName);
  }
}
