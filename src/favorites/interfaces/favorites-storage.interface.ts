import { Favorite } from '../entities/favorite.entity';

export interface IFavoritesStorage {
  getAll: () => Promise<Favorite>;
  addTrack: (id: string) => Promise<string | null>;
  deleteTrack: (id: string) => Promise<boolean>;
  addAlbum: (id: string) => Promise<string | null>;
  deleteAlbum: (id: string) => Promise<boolean>;
  addArtist: (id: string) => Promise<string | null>;
  deleteArtist: (id: string) => Promise<boolean>;
}
