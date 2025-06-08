import { PrismaService } from 'src/prisma/prisma.service';
import { IFavoritesStorage } from '../interfaces/favorites-storage.interface';
import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Favorite } from '../entities/favorite.entity';

@Injectable()
export class PrismaFavoritesStorage implements IFavoritesStorage {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const favoriteTracks = await this.prisma.favoriteTrack.findMany({});
    const favoriteAlbums = await this.prisma.favoriteAlbum.findMany({});
    const favoriteArtists = await this.prisma.favoriteArtist.findMany({});
    const favoriteIds: Favorite = {
      albums: favoriteAlbums.map((entity) => entity.albumId),
      artists: favoriteArtists.map((entity) => entity.artistId),
      tracks: favoriteTracks.map((entity) => entity.trackId),
    };
    return favoriteIds;
  }

  async addTrack(id: string) {
    const track = await this.prisma.favoriteTrack.create({
      data: { trackId: id },
    });
    return track.trackId;
  }

  async deleteTrack(id: string) {
    try {
      await this.prisma.favoriteTrack.delete({ where: { trackId: id } });
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

  async addAlbum(id: string) {
    const album = await this.prisma.favoriteAlbum.create({
      data: { albumId: id },
    });
    return album.albumId;
  }

  async deleteAlbum(id: string) {
    try {
      await this.prisma.favoriteAlbum.delete({ where: { albumId: id } });
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
  async addArtist(id: string) {
    const artist = await this.prisma.favoriteArtist.create({
      data: { artistId: id },
    });
    return artist.artistId;
  }
  async deleteArtist(id: string) {
    try {
      await this.prisma.favoriteArtist.delete({ where: { artistId: id } });
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
