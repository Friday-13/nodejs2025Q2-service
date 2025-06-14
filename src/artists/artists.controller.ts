import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
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
} from '@nestjs/swagger';
import { Artist } from './entities/artist.entity';

@ApiTags('Artists')
@ApiBearerAuth()
@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get artists list',
    description: 'Gets all artists list',
  })
  @ApiOkResponse({
    description: 'Successful operation',
    type: Artist,
    isArray: true,
  })
  async findAll() {
    return await this.artistsService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Add new artist',
    description: 'Add new artist information',
  })
  @ApiCreatedResponse({
    description: 'The artist has been created.',
    type: Artist,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. Body does not contain required fields',
  })
  async create(@Body() createArtistDto: CreateArtistDto) {
    return await this.artistsService.create(createArtistDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single artist by id',
    description: 'Get single artist by id',
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiOkResponse({
    description: 'Successful operation',
    type: Artist,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. Artist id is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Atist not found' })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const artist = await this.artistsService.getById(id);
      return artist;
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new NotFoundException(err.message);
      }
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update artist information',
    description: 'Update artist information by id',
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiOkResponse({
    description: 'The artist information has been updated',
    type: Artist,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. Artist id is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    try {
      return await this.artistsService.update(id, updateArtistDto);
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
    summary: 'Delete artist',
    description: 'Delete artist from library by id',
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiBadRequestResponse({
    description: 'Bad request. Artist id is invalid (not uuid)',
  })
  @ApiNoContentResponse({
    description: 'Artist has been deleted',
  })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.artistsService.delete(id);
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }
}
