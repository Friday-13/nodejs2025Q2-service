import { Injectable } from '@nestjs/common';
import { Track } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';
import { ITrackStorage } from '../interfaces/track-storage.interface';

@Injectable()
export class PrismaTrackStorage implements ITrackStorage {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const tracks = await this.prisma.track.findMany({});
    return tracks;
  }

  async getById(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id: id } });
    return track;
  }

  async filterByIds(ids: string[]) {
    const tracks = await this.prisma.track.findMany({
      where: { id: { in: ids } },
    });
    return tracks;
  }

  async create(dto: CreateTrackDto) {
    const track = await this.prisma.track.create({ data: dto });
    return track;
  }

  async update(id: string, dto: UpdateTrackDto) {
    const track = await this.prisma.track.update({
      where: { id: id },
      data: dto,
    });
    return track;
  }

  async delete(id: string) {
    try {
      await this.prisma.track.delete({ where: { id: id } });
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

  async filterByArtistId(id: string): Promise<Track[]> {
    return await this.prisma.track.findMany({ where: { artistId: id } });
  }

  async filterByAlbumId(id: string): Promise<Track[]> {
    return await this.prisma.track.findMany({ where: { albumId: id } });
  }
}
