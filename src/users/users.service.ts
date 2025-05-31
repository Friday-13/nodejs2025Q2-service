import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
import { IUserStorage } from './interfaces/user-storage.interface';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('IUserStorage') private storage: IUserStorage) {}

  create(dto: CreateUserDto): ResponseUserDto {
    const user = this.storage.create(dto);
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

  findAll() {
    return this.storage.getAll();
  }

  getById(id: string) {
    return this.storage.getById(id);
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = this.storage.getById(id);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new Error('INVALID_OLD_PASSWORD');
    }
    const updatedUser = this.storage.update(id, updatePasswordDto);
    const withoutPasswordUser: ResponseUserDto = {
      id: updatedUser.id,
      login: updatedUser.login,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      version: updatedUser.version,
    };
    return withoutPasswordUser;
  }

  delete(id: string) {
    return this.storage.delete(id);
  }
}
