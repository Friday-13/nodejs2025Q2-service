import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ITrackStorage } from './interfaces/track-storage.interface';
import TrackDoesntExist from './errors/track-doesnt-exist.error';

@Injectable()
export class TracksService {
  constructor(@Inject('ITrackStorage') private storage: ITrackStorage) {}
  async create(createTrackDto: CreateTrackDto) {
    return await this.storage.create(createTrackDto);
  }

  async findAll() {
    return await this.storage.getAll();
  }

  async filterByIds(ids: string[]) {
    return await this.storage.filterByIds(ids);
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
  }
}
