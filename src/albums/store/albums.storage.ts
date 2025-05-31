import { Injectable } from '@nestjs/common';
import { InMemoryAbstractStorage } from 'src/abstract/abstract-in-memory.storage';
import { Album } from '../entities/album.entity';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class InMemoryAlbumStorage extends InMemoryAbstractStorage<
  Album,
  CreateAlbumDto,
  UpdateAlbumDto
> {
  async create(dto: CreateAlbumDto): Promise<Album> {
    const newAlbum: Album = {
      id: randomUUID(),
      name: dto.name,
      artistId: dto.artistId,
      year: dto.year,
    };
    this.storage.push(newAlbum);
    return Promise.resolve(newAlbum);
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    const album = await this.getById(id);
    if (!album) {
      return null;
    }
    album.name = dto.name || album.name;
    album.year = dto.year !== null ? dto.year : album.year;
    album.artistId = dto.artistId || album.artistId;
    return album;
  }
}
