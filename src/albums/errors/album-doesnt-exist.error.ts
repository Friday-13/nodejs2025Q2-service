import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';

export default class AlbumDoesntExist extends RecordDoesntExist {
  constructor(id: string) {
    super('album', id);
  }
}
