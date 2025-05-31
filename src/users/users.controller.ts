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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
import { UserDoesntExist } from './errors/user-doesnt-exist.error';
import InvalidCredentials from './errors/invalid-credentials.error';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async getAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const user = await this.usersService.getById(id);
      return user;
    } catch (err) {
      if (err instanceof UserDoesntExist) {
        throw new NotFoundException(err.message);
      }
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    try {
      const user = await this.usersService.update(id, updatePasswordDto);
      return user;
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
