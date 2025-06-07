import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { IArtistStorage } from './interfaces/artis-storage.interface';
import ArtistDoesntExist from './errors/artist-doesnt-exist.error';
import { FavoritesService } from 'src/favorites/favorites.service';
import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';
import { AlbumsService } from 'src/albums/albums.service';
import { TracksService } from 'src/tracks/tracks.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject('IArtistStorage') private storage: IArtistStorage,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
  ) {}
  async create(createArtistDto: CreateArtistDto) {
    return await this.storage.create(createArtistDto);
  }

  async findAll() {
    return await this.storage.getAll();
  }

  async filterByIds(ids: string[]) {
    return await this.storage.filterByIds(ids);
  }

  async getById(id: string) {
    const artist = await this.storage.getById(id);
    if (!artist) {
      throw new ArtistDoesntExist(id);
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.storage.getById(id);
    if (!artist) {
      throw new ArtistDoesntExist(id);
    }
    const updatedArtist = await this.storage.update(id, updateArtistDto);
    return updatedArtist;
  }

  async delete(id: string) {
    const result = await this.storage.delete(id);
    if (!result) {
      throw new ArtistDoesntExist(id);
    }
    // await this.deleteFromFavorites(id);
    // await this.deleteRelatedTrackLinks(id);
    // await this.deleteRelatedAlbumsLinks(id);
  }

  async deleteFromFavorites(id: string) {
    try {
      await this.favoritesService.deleteArtist(id);
    } catch (err) {
      if (!(err instanceof RecordDoesntExist)) {
        throw err;
      }
    }
  }

  private async deleteRelatedTrackLinks(id: string) {
    const tracks = await this.tracksService.filterByArtistId(id);
    tracks.forEach(async (track) => {
      await this.tracksService.update(track.id, { ...track, artistId: null });
    });
  }

  private async deleteRelatedAlbumsLinks(id: string) {
    const albums = await this.albumsService.filterByArtistId(id);
    albums.forEach(async (album) => {
      await this.albumsService.update(album.id, { ...album, artistId: null });
    });
  }
}
