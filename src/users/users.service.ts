import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
import { IUserStorage } from './interfaces/user-storage.interface';
import { ResponseUserDto } from './dto/response-user.dto';
import { UserDoesntExist } from './errors/user-doesnt-exist.error';
import InvalidCredentials from './errors/invalid-credentials.error';
import LoginAlreadyExists from './errors/login-already-exists.error';

@Injectable()
export class UsersService {
  constructor(@Inject('IUserStorage') private storage: IUserStorage) {}

  async create(dto: CreateUserDto): Promise<ResponseUserDto> {
    const user = await this.storage.create(dto);
    if (!user) {
      throw new LoginAlreadyExists(dto.login);
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
    const user = await this.storage.getById(id);
    if (!user) {
      throw new UserDoesntExist(id);
    }
    return user;
  }

  async getByLogin(login: string) {
    const user = await this.storage.getByLogin(login);
    if (!user) {
      throw new UserDoesntExist(login, 'login');
    }
    return user;
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.storage.getById(id);
    if (!user) {
      throw new UserDoesntExist(id);
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new InvalidCredentials('Old password');
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
    const result = await this.storage.delete(id);
    if (!result) {
      throw new UserDoesntExist(id);
    }
  }
}
