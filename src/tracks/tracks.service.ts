import { Inject, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ITrackStorage } from './interfaces/track-storage.interface';

@Injectable()
export class TracksService {
  constructor(@Inject('ITrackStorage') private storage: ITrackStorage) {}
  async create(createTrackDto: CreateTrackDto) {
    return await this.storage.create(createTrackDto);
  }

  async findAll() {
    return await this.storage.getAll();
  }

  async getById(id: string) {
    return await this.storage.getById(id);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    return await this.storage.update(id, updateTrackDto);
  }

  async delete(id: string) {
    return await this.storage.delete(id);
  }
}
