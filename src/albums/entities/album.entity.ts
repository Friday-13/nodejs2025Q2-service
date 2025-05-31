import { AbstractEntity } from 'src/abstract/abstract.entity';

export class Album extends AbstractEntity {
  name: string;
  year: number;
  artistId: string | null;
}
