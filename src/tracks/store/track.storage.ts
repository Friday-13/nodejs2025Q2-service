import { randomUUID } from 'crypto';
import { CreateTrackDto } from '../dto/create-track.dto';
import { ITrackStorage } from '../interfaces/track-storage.interface';
import { Track } from '../entities/track.entity';
import { Injectable } from '@nestjs/common';
import { UpdateTrackDto } from '../dto/update-track.dto';

@Injectable()
export class InMemoryTrackStorage implements ITrackStorage {
  private storage: Track[] = [];
  constructor() {}
  async getAll() {
    return this.storage;
  }

  async getById(id: string) {
    return this.storage.find((track) => track.id === id) || null;
  }

  async create(dto: CreateTrackDto) {
    const track: Track = {
      id: randomUUID(),
      albumId: dto.albumId || null,
      artistId: dto.artistId || null,
      duration: dto.duration,
      name: dto.name,
    };
    this.storage.push(track);
    return track;
  }

  async update(id: string, dto: UpdateTrackDto) {
    const track = await this.getById(id);
    if (!track) {
      return null;
    }
    track.name = dto.name || track.name;
    track.artistId = dto.artistId || track.artistId;
    track.albumId = dto.albumId || track.albumId;
    track.duration = dto.duration || track.duration;

    return track;
  }

  async delete(id: string) {
    const trackIndex = this.storage.findIndex((track) => track.id === id);
    if (trackIndex < 0) {
      return false;
    }
    this.storage.splice(trackIndex, 1);
    return true;
  }
}
