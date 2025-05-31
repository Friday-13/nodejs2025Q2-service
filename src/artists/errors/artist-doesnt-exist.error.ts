import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';

export default class ArtistDoesntExist extends RecordDoesntExist {
  constructor(id: string) {
    super('artist', id);
  }
}
