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
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
import { UserDoesntExist } from './errors/user-doesnt-exist.error';
import InvalidCredentials from './errors/invalid-credentials.error';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { LoggingService } from 'src/logging/logging.service';
import RecordAlreadyExists from 'src/errors/record-already-exists.error';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private logging: LoggingService,
  ) {
    this.logging.setContext('Users');
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Gets all users' })
  @ApiOkResponse({
    description: 'Successful operation',
    type: User,
    isArray: true,
  })
  async getAll() {
    const res = await this.usersService.findAll();
    throw new Error('hehehe');
    return res;
  }

  @Post()
  @ApiOperation({ summary: 'Create user', description: 'Creates a new user' })
  @ApiCreatedResponse({
    description: 'The user has been created.',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. body does not contain required fields',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const res = await this.usersService.create(createUserDto);
      return res;
    } catch (err) {
      if (err instanceof RecordAlreadyExists) {
        throw new ConflictException(err.message);
      }
      throw err;
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single user by id',
    description: 'Get single user by id',
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiOkResponse({
    description: 'Successful operation',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. id is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const user = await this.usersService.getById(id);
      return user;
    } catch (err) {
      if (err instanceof UserDoesntExist) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: "Update a user's password",
    description: "Updates a user's password by id",
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiOkResponse({
    description: 'The user has been updated',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiForbiddenResponse({
    description: 'oldPassword is wrong',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    try {
      const response = await this.usersService.update(id, updatePasswordDto);
      return response;
    } catch (err) {
      if (err instanceof UserDoesntExist) {
        throw new NotFoundException(err.message);
      }
      if (err instanceof InvalidCredentials) {
        throw new ForbiddenException(err.message);
      }
      throw err;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete user by id',
  })
  @ApiParam({ name: 'id', format: 'uuid', required: true })
  @ApiBadRequestResponse({
    description: 'Bad request. User id is invalid (not uuid)',
  })
  @ApiNoContentResponse({
    description: 'The user has been deleted',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.usersService.delete(id);
    } catch (err) {
      if (err instanceof UserDoesntExist) {
        throw new NotFoundException(err.message);
      }
    }
  }
}
