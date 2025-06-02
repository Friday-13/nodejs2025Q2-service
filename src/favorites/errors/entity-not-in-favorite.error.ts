import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';

type TEntity = 'artist' | 'track' | 'album';

export class EntityNotInFavorite extends RecordDoesntExist {
  constructor(entity: TEntity, id: string) {
    super(entity, id);
  }
}
