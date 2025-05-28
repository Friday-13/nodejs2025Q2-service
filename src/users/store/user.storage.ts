import { Injectable } from '@nestjs/common';
import { IUserStorage } from '../interfaces/user-storage.interface';
import { User } from '../entities/user.entity';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-user-password.dto';

@Injectable()
export class InMemoryUserStorage implements IUserStorage {
  private storage: User[] = [];
  constructor() {}

  getAll() {
    return this.storage;
  }

  getById(id: string) {
    return this.storage.find((user) => user.id === id) || null;
  }

  create(dto: CreateUserDto) {
    //TODO: need verify?
    const user: User = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 0,
    };
    this.storage.push(user);
    return user;
  }

  updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = this.storage.find((user) => user.id === id);
    if (!user) {
      return null;
    }
    if (user.password !== dto.oldPassword) {
      //TODO: throw error
      return null;
    }
    user.password = dto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return user;
  }

  remove(id: string) {
    const userIndex = this.storage.findIndex((user) => user.id === id);
    if (userIndex < 0) {
      return false;
    }
    this.storage.splice(userIndex, 1);
    return true;
  }
}
