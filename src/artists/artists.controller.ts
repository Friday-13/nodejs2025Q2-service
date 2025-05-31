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

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto) {
    return await this.artistsService.create(createArtistDto);
  }

  @Get()
  async findAll() {
    return await this.artistsService.findAll();
  }

  @Get(':id')
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
