import { IAbstractStorage } from 'src/abstract/abstract-storage.interface';
import { Track } from '../entities/track.entity';
import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';

export interface ITrackStorage
  extends IAbstractStorage<Track, CreateTrackDto, UpdateTrackDto> {
  filterByArtistId: (id: string) => Promise<Track[]>;
  filterByAlbumId: (id: string) => Promise<Track[]>;
}
