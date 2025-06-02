import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import RecordDoesntExist from 'src/errors/record-doesnt-exist.error';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Track } from './entities/track.entity';

@ApiTags('Tracks')
@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @ApiOperation({
    summary: 'Get tracks list',
    description: 'Gets all library tracks list',
  })
  @ApiOkResponse({
    description: 'Successful operation',
    type: Track,
    isArray: true,
  })
  async findAll() {
    return await this.tracksService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Add new track',
    description: 'Add new track information',
  })
  @ApiCreatedResponse({
    description: 'The track has been created.',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. body does not contain required fields',
  })
  async create(@Body() createTrackDto: CreateTrackDto) {
    return await this.tracksService.create(createTrackDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single track by id',
    description: 'Get single track by id',
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiOkResponse({
    description: 'Successful operation',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. id is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Track not found' })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const track = await this.tracksService.getById(id);
      return track;
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new NotFoundException(err.message);
      }
    }
    return await this.tracksService.getById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update track information',
    description: 'Update library track information by id',
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiOkResponse({
    description: 'The track information has been updated',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. id is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Track not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    try {
      return await this.tracksService.update(id, updateTrackDto);
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
    summary: 'Delete track',
    description: 'Delete track from library by id',
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiBadRequestResponse({
    description: 'Bad request. Track id is invalid (not uuid)',
  })
  @ApiNoContentResponse({
    description: 'Track has been deleted',
  })
  @ApiNotFoundResponse({ description: 'Track not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.tracksService.delete(id);
    } catch (err) {
      if (err instanceof RecordDoesntExist) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }
}
