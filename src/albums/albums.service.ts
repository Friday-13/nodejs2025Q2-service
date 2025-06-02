import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import AlbumDoesntExist from './errors/album-doesnt-exist.error';
import { IAlbumStorage } from './interfaces/album-storage.interfafce';
import { FavoritesService } from 'src/favorites/favorites.service';
import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';
import { TracksService } from 'src/tracks/tracks.service';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject('IAlbumStorage') private storage: IAlbumStorage,

    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
  ) {}
  async create(createAlbumDto: CreateAlbumDto) {
    return await this.storage.create(createAlbumDto);
  }

  async findAll() {
    return await this.storage.getAll();
  }

  async filterByIds(ids: string[]) {
    return await this.storage.filterByIds(ids);
  }

  async filterByArtistId(id: string) {
    return await this.storage.filterByArtistId(id);
  }

  async getById(id: string) {
    const album = await this.storage.getById(id);
    if (!album) {
      throw new AlbumDoesntExist(id);
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.storage.getById(id);
    if (!album) {
      throw new AlbumDoesntExist(id);
    }
    const updatedAlbum = await this.storage.update(id, updateAlbumDto);
    return updatedAlbum;
  }

  async delete(id: string) {
    const result = await this.storage.delete(id);
    if (!result) {
      throw new AlbumDoesntExist(id);
    }
    await this.deleteFromFavorites(id);
    await this.deleteRelatedTrackLinks(id);
  }

  async deleteFromFavorites(id: string) {
    try {
      await this.favoritesService.deleteAlbum(id);
    } catch (err) {
      if (!(err instanceof RecordDoesntExist)) {
        throw err;
      }
    }
  }

  private async deleteRelatedTrackLinks(id: string) {
    const tracks = await this.tracksService.filterByAlbumId(id);
    tracks.forEach(async (track) => {
      await this.tracksService.update(track.id, { ...track, albumId: null });
    });
  }
}
