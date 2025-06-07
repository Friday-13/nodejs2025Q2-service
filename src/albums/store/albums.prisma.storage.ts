import { Injectable } from '@nestjs/common';
import { Album } from '@prisma/client';
import { IAbstractStorage } from 'src/abstract/abstract-storage.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';

@Injectable()
export class PrismaAlbumStorage
  implements IAbstractStorage<Album, CreateAlbumDto, UpdateAlbumDto>
{
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const albums = await this.prisma.album.findMany({});
    return albums;
  }

  async getById(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id: id } });
    return album;
  }

  async filterByIds(ids: string[]) {
    const albums = await this.prisma.album.findMany({
      where: { id: { in: ids } },
    });
    return albums;
  }

  async create(dto: CreateAlbumDto) {
    const album = await this.prisma.album.create({ data: dto });
    return album;
  }

  async update(id: string, dto: UpdateAlbumDto) {
    const album = await this.prisma.album.update({
      where: { id: id },
      data: dto,
    });
    return album;
  }

  async delete(id: string) {
    try {
      await this.prisma.album.delete({ where: { id: id } });
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
  async filterByArtistId(id: string): Promise<Album[]> {
    return await this.prisma.album.findMany({ where: { artistId: id } });
  }
}
