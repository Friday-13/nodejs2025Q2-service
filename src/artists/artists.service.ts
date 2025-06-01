import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { IArtistStorage } from './interfaces/artis-storage.interface';
import ArtistDoesntExist from './errors/artist-doesnt-exist.error';
import { FavoritesService } from 'src/favorites/favorites.service';
import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject('IArtistStorage') private storage: IArtistStorage,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
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
    try {
      await this.favoritesService.deleteArtist(id);
    } catch (err) {
      if (!(err instanceof RecordDoesntExist)) {
        throw err;
      }
    }
  }
}
