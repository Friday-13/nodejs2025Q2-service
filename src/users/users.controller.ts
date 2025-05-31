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
    const user = await this.usersService.getById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} doesn't exist`);
    }
    return user;
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
      if (err.message === 'USER_NOT_FOUND') {
        throw new NotFoundException(`User with id ${id} doesn't exist`);
      }
      if (err.message === 'INVALID_OLD_PASSWORD') {
        throw new ForbiddenException('Old password is incorrect');
      }
      throw err;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const isSuccess = await this.usersService.delete(id);
    if (!isSuccess) {
      throw new NotFoundException(`User with id ${id} doesn't exist`);
    }
  }
}
