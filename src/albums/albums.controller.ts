import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Album } from './entities/album.entity';

@ApiTags('Albums')
@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get albums list',
    description: 'Gets all library albums list',
  })
  @ApiOkResponse({
    description: 'Successful operation',
    type: Album,
    isArray: true,
  })
  async findAll() {
    return await this.albumsService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Add new album',
    description: 'Add new album information',
  })
  @ApiCreatedResponse({
    description: 'The album has been created.',
    type: Album,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. body does not contain required fields',
  })
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    return await this.albumsService.create(createAlbumDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single album by id',
    description: 'Get single album by id',
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiOkResponse({
    description: 'Successful operation',
    type: Album,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. Album id is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Album not found' })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const album = await this.albumsService.getById(id);
      return album;
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new NotFoundException(err.message);
      }
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update album information',
    description: 'Update album information by id',
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiOkResponse({
    description: 'The album information has been updated',
    type: Album,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. Album id is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Album not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    try {
      return await this.albumsService.update(id, updateAlbumDto);
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete album',
    description: 'Delete album from library by id',
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiBadRequestResponse({
    description: 'Bad request. Album id is invalid (not uuid)',
  })
  @ApiNoContentResponse({
    description: 'Album has been deleted',
  })
  @ApiNotFoundResponse({ description: 'Album not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.albumsService.delete(id);
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }
}
