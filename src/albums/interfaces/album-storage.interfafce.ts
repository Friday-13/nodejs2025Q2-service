import { IAbstractStorage } from 'src/abstract/abstract-storage.interface';
import { Album } from '../entities/album.entity';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';

export interface IAlbumStorage
  extends IAbstractStorage<Album, CreateAlbumDto, UpdateAlbumDto> {
  filterByArtistId: (id: string) => Promise<Album[]>;
}
