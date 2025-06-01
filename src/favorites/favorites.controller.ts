import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
  ParseUUIDPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll() {
    return await this.favoritesService.findAll();
  }

  private async addEntity<T>(
    id: string,
    addCallback: (id: string) => Promise<T>,
  ) {
    try {
      return await addCallback(id);
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new UnprocessableEntityException(err.message);
      }
      throw err;
    }
  }

  private async deleteEntity<T>(
    id: string,
    deleteCallback: (id: string) => Promise<T>,
  ) {
    try {
      await deleteCallback(id);
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  @Post('track/:id')
  async addTrack(@Param('id', ParseUUIDPipe) id: string) {
    return await this.addEntity(
      id,
      this.favoritesService.addTrack.bind(this.favoritesService),
    );
  }

  @Delete('track/:id')
  @HttpCode(204)
  async deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
    return await this.deleteEntity(
      id,
      this.favoritesService.deleteTrack.bind(this.favoritesService),
    );
  }

  @Post('artist/:id')
  async addArtist(@Param('id', ParseUUIDPipe) id: string) {
    return await this.addEntity(
      id,
      this.favoritesService.addArtist.bind(this.favoritesService),
    );
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
    return await this.deleteEntity(
      id,
      this.favoritesService.deleteArtist.bind(this.favoritesService),
    );
  }

  @Post('album/:id')
  async addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return await this.addEntity(
      id,
      this.favoritesService.addAlbum.bind(this.favoritesService),
    );
  }

  @Delete('album/:id')
  @HttpCode(204)
  async deleteAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return await this.deleteEntity(
      id,
      this.favoritesService.deleteAlbum.bind(this.favoritesService),
    );
  }
}
