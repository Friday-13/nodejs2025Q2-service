import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ITrackStorage } from './interfaces/track-storage.interface';
import TrackDoesntExist from './errors/track-doesnt-exist.error';
import { FavoritesService } from 'src/favorites/favorites.service';
import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';

@Injectable()
export class TracksService {
  constructor(
    @Inject('ITrackStorage') private storage: ITrackStorage,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}
  async create(createTrackDto: CreateTrackDto) {
    return await this.storage.create(createTrackDto);
  }

  async findAll() {
    return await this.storage.getAll();
  }

  async filterByIds(ids: string[]) {
    return await this.storage.filterByIds(ids);
  }

  async filterByAlbumId(id: string) {
    return await this.storage.filterByAlbumId(id);
  }

  async filterByArtistId(id: string) {
    return await this.storage.filterByArtistId(id);
  }

  async getById(id: string) {
    const track = await this.storage.getById(id);
    if (!track) {
      throw new TrackDoesntExist(id);
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.storage.getById(id);
    if (!track) {
      throw new TrackDoesntExist(id);
    }
    const updatedTrack = await this.storage.update(id, updateTrackDto);
    return updatedTrack;
  }

  async delete(id: string) {
    const result = await this.storage.delete(id);
    if (!result) {
      throw new TrackDoesntExist(id);
    }
    this.deleteFromFavorites(id);
  }

  private async deleteFromFavorites(id: string) {
    try {
      await this.favoritesService.deleteTrack(id);
    } catch (err) {
      if (!(err instanceof RecordDoesntExist)) {
        throw err;
      }
    }
  }
}
