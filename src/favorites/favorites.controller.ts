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

  @Post('track/:id')
  async addTrack(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.favoritesService.addTrack(id);
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new UnprocessableEntityException(err.message);
      }
      throw err;
    }
  }

  @Delete('track/:id')
  @HttpCode(204)
  async deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.favoritesService.deleteTrack(id);
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  @Post('artist/:id')
  async addArtist(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.favoritesService.addArtist(id);
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new UnprocessableEntityException(err.message);
      }
      throw err;
    }
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.favoritesService.deleteArtist(id);
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  @Post('album/:id')
  async addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.favoritesService.addAlbum(id);
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new UnprocessableEntityException(err.message);
      }
      throw err;
    }
  }

  @Delete('album/:id')
  @HttpCode(204)
  async deleteAlbum(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.favoritesService.deleteAlbum(id);
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }
}
