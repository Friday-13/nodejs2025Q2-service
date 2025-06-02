import { InMemoryAbstractStorage } from 'src/abstract/abstract-in-memory.storage';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';
import { Injectable } from '@nestjs/common';
import { Artist } from '../entities/artist.entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class InMemoryArtistStorage extends InMemoryAbstractStorage<
  Artist,
  CreateArtistDto,
  UpdateArtistDto
> {
  async create(dto: CreateArtistDto): Promise<Artist> {
    const newArtist: Artist = {
      id: randomUUID(),
      grammy: dto.grammy,
      name: dto.name,
    };
    this.storage.push(newArtist);
    return Promise.resolve(newArtist);
  }

  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.getById(id);
    if (!artist) {
      return null;
    }
    artist.name = dto.name || artist.name;
    artist.grammy = dto.grammy !== null ? dto.grammy : artist.grammy;
    return artist;
  }
}
