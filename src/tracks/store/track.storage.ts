import { randomUUID } from 'crypto';
import { CreateTrackDto } from '../dto/create-track.dto';
import { Track } from '../entities/track.entity';
import { Injectable } from '@nestjs/common';
import { UpdateTrackDto } from '../dto/update-track.dto';
import { InMemoryAbstractStorage } from 'src/abstract/abstract-in-memory.storage';
import { ITrackStorage } from '../interfaces/track-storage.interface';

@Injectable()
export class InMemoryTrackStorage
  extends InMemoryAbstractStorage<Track, CreateTrackDto, UpdateTrackDto>
  implements ITrackStorage
{
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
    track.artistId =
      dto.artistId === null || dto.artistId ? dto.artistId : track.artistId;
    track.albumId =
      dto.albumId === null || dto.albumId ? dto.albumId : track.albumId;
    track.duration = dto.duration || track.duration;

    return track;
  }

  async filterByArtistId(id: string): Promise<Track[]> {
    return this.storage.filter((item) => item.artistId === id);
  }

  async filterByAlbumId(id: string): Promise<Track[]> {
    return this.storage.filter((item) => item.albumId === id);
  }
}
