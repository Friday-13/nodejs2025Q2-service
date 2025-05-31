import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
import { IUserStorage } from './interfaces/user-storage.interface';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('IUserStorage') private storage: IUserStorage) {}

  async create(dto: CreateUserDto): Promise<ResponseUserDto> {
    const user = await this.storage.create(dto);
    if (!user) {
      return null;
    }
    const withoutPasswordUser: ResponseUserDto = {
      id: user.id,
      login: user.login,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      version: user.version,
    };
    return withoutPasswordUser;
  }

  async findAll() {
    return await this.storage.getAll();
  }

  async getById(id: string) {
    return await this.storage.getById(id);
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.storage.getById(id);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new Error('INVALID_OLD_PASSWORD');
    }
    const updatedUser = await this.storage.update(id, updatePasswordDto);
    const withoutPasswordUser: ResponseUserDto = {
      id: updatedUser.id,
      login: updatedUser.login,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      version: updatedUser.version,
    };
    return withoutPasswordUser;
  }

  async delete(id: string) {
    return await this.storage.delete(id);
  }
}
