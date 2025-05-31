import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';

export default class TrackDoesntExist extends RecordDoesntExist {
  constructor(id: string) {
    super('track', id);
  }
}
