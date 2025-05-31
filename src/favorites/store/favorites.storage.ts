import { Favorite } from '../entities/favorite.entity';
import { IFavoritesStorage } from '../interfaces/favorites-storage.interface';

export class ImMemoryFavoritesStorage implements IFavoritesStorage {
  protected tracks: string[] = [];
  protected artist: string[] = [];
  protected albums: string[] = [];
  constructor() {}

  async getAll() {
    const favoriteIds: Favorite = {
      tracks: this.tracks,
      albums: this.albums,
      artists: this.artist,
    };
    return favoriteIds;
  }

  private async addEntity(id: string, entityStorage: string[]) {
    if (!entityStorage.includes(id)) {
      entityStorage.push(id);
    }
    return id;
  }
  private async deleteEntity(id: string, entityStorage: string[]) {
    const recordIndex = entityStorage.findIndex((record) => record === id);
    if (recordIndex < 0) {
      return false;
    }
    entityStorage.splice(recordIndex, 1);
    return true;
  }

  async addTrack(id: string) {
    return await this.addEntity(id, this.tracks);
  }
  async deleteTrack(id: string) {
    return await this.deleteEntity(id, this.tracks);
  }

  async addAlbum(id: string) {
    return await this.addEntity(id, this.albums);
  }
  async deleteAlbum(id: string) {
    return await this.deleteEntity(id, this.albums);
  }

  async addArtist(id: string) {
    return await this.addEntity(id, this.artist);
  }
  async deleteArtist(id: string) {
    return await this.deleteEntity(id, this.artist);
  }
}
