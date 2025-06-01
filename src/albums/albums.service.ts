import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import AlbumDoesntExist from './errors/album-doesnt-exist.error';
import { IAlbumStorage } from './interfaces/album-storage.interfafce';
import { FavoritesService } from 'src/favorites/favorites.service';
import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject('IAlbumStorage') private storage: IAlbumStorage,

    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
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
    try {
      await this.favoritesService.deleteAlbum(id);
    } catch (err) {
      if (!(err instanceof RecordDoesntExist)) {
        throw err;
      }
    }
  }
}
