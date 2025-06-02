import { IAbstractStorage } from 'src/abstract/abstract-storage.interface';
import { Artist } from '../entities/artist.entity';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';

export interface IArtistStorage
  extends IAbstractStorage<Artist, CreateArtistDto, UpdateArtistDto> {}
