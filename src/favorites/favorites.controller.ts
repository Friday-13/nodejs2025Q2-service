import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
  ParseUUIDPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Track } from 'src/tracks/entities/track.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { ResponseFavoritesDto } from './dto/response-favorites.dto';

@ApiTags('Favorites')
@ApiBearerAuth()
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get favorites',
    description: 'Gets all favorites movies, tracks and books',
  })
  @ApiOkResponse({
    description: 'Successful operation',
    type: ResponseFavoritesDto,
  })
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
  @ApiOperation({
    summary: 'Add track to the favorites',
    description: 'Add track to the favorites',
  })
  @ApiCreatedResponse({
    description: 'The track has been added to favorites',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. Track id is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({ description: 'Track with id not found' })
  async addTrack(@Param('id', ParseUUIDPipe) id: string) {
    return await this.addEntity(
      id,
      this.favoritesService.addTrack.bind(this.favoritesService),
    );
  }

  @Delete('track/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete track',
    description: 'Delete track from favorites by id',
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiBadRequestResponse({
    description: 'Bad request. Track id is invalid (not uuid)',
  })
  @ApiNoContentResponse({
    description: 'Track has been deleted from favorites',
  })
  @ApiNotFoundResponse({ description: 'Track not found' })
  async deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
    return await this.deleteEntity(
      id,
      this.favoritesService.deleteTrack.bind(this.favoritesService),
    );
  }

  @Post('artist/:id')
  @ApiOperation({
    summary: 'Add artist to the favorites',
    description: 'Add artist to the favorites',
  })
  @ApiCreatedResponse({
    description: 'The artist has been created.',
    type: Artist,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. Artist id is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({ description: 'Artist with id not found' })
  async addArtist(@Param('id', ParseUUIDPipe) id: string) {
    return await this.addEntity(
      id,
      this.favoritesService.addArtist.bind(this.favoritesService),
    );
  }

  @Delete('artist/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete artist from favorites',
    description: 'Delete artist from favorites by id',
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiBadRequestResponse({
    description: 'Bad request. Artist id is invalid (not uuid)',
  })
  @ApiNoContentResponse({
    description: 'Artist has been deleted from the favorites',
  })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  async deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
    return await this.deleteEntity(
      id,
      this.favoritesService.deleteArtist.bind(this.favoritesService),
    );
  }

  @Post('album/:id')
  @ApiOperation({
    summary: 'Add album to the favorites',
    description: 'Add album to the favorites',
  })
  @ApiCreatedResponse({
    description: 'The album has been created.',
    type: Album,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. Album id is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({ description: 'Album with id not found' })
  async addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return await this.addEntity(
      id,
      this.favoritesService.addAlbum.bind(this.favoritesService),
    );
  }

  @Delete('album/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete album from favorites',
    description: 'Delete album from favorites by id',
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiBadRequestResponse({
    description: 'Bad request. Album id is invalid (not uuid)',
  })
  @ApiNoContentResponse({
    description: 'Album has been deleted from favorites',
  })
  @ApiNotFoundResponse({ description: 'Album not found' })
  async deleteAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return await this.deleteEntity(
      id,
      this.favoritesService.deleteAlbum.bind(this.favoritesService),
    );
  }
}
