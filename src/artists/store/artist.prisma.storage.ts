import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { IArtistStorage } from '../interfaces/artis-storage.interface';

@Injectable()
export class PrismaArtistStorage implements IArtistStorage {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const artists = await this.prisma.artist.findMany({});
    return artists;
  }

  async getById(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id: id } });
    return artist;
  }

  async filterByIds(ids: string[]) {
    const artists = await this.prisma.artist.findMany({
      where: { id: { in: ids } },
    });
    return artists;
  }

  async create(dto: CreateArtistDto) {
    const artist = await this.prisma.artist.create({ data: dto });
    return artist;
  }

  async update(id: string, dto: UpdateArtistDto) {
    const artist = await this.prisma.artist.update({
      where: { id: id },
      data: dto,
    });
    return artist;
  }

  async delete(id: string) {
    try {
      await this.prisma.artist.delete({ where: { id: id } });
      return true;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          return false;
        }
      }
      throw err;
    }
  }
}
