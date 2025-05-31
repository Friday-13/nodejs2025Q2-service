import { Inject, Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { IFavoritesStorage } from './interfaces/favorites-storage.interface';
import { ResponseFavoritesDto } from './dto/response-favorites.dto';
import { TracksService } from 'src/tracks/tracks.service';
import { ArtistsService } from 'src/artists/artists.service';
import { AlbumsService } from 'src/albums/albums.service';
import { Track } from 'src/tracks/entities/track.entity';
import { EntityNotInFavorite } from './errors/entity-not-in-favorite.error';
import { Artist } from 'src/artists/entities/artist.entity';
import { Album } from 'src/albums/entities/album.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject('IFavoritesStorage') private storage: IFavoritesStorage,
    private trackService: TracksService,
    private artistService: ArtistsService,
    private albumService: AlbumsService,
  ) {}

  async findAll(): Promise<ResponseFavoritesDto> {
    const favorites = await this.storage.getAll();
    const tracks = await this.trackService.filterByIds(favorites.tracks);
    const albums = await this.albumService.filterByIds(favorites.albums);
    const artists = await this.artistService.filterByIds(favorites.artists);
    return { artists, albums, tracks };
  }

  async addTrack(id: string): Promise<Track> {
    const track = await this.trackService.getById(id);
    await this.storage.addTrack(id);
    return track;
  }

  async deleteTrack(id: string) {
    const result = await this.storage.deleteTrack(id);
    if (!result) {
      throw new EntityNotInFavorite('track', id);
    }
  }

  async addArtist(id: string): Promise<Artist> {
    const artist = await this.artistService.getById(id);
    await this.storage.addArtist(id);
    return artist;
  }

  async deleteArtist(id: string) {
    const result = await this.storage.deleteArtist(id);
    if (!result) {
      throw new EntityNotInFavorite('artist', id);
    }
  }

  async addAlbum(id: string): Promise<Album> {
    const album = await this.albumService.getById(id);
    await this.storage.addAlbum(id);
    return album;
  }

  async deleteAlbum(id: string) {
    const result = await this.storage.deleteAlbum(id);
    if (!result) {
      throw new EntityNotInFavorite('album', id);
    }
  }
}
