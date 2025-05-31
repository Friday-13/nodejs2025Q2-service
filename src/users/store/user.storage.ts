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
    const user: User = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    };
    this.storage.push(user);
    return user;
  }

  update(id: string, dto: UpdatePasswordDto) {
    const user = this.getById(id);
    if (!user) {
      return null;
    }
    user.password = dto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return user;
  }

  delete(id: string) {
    const userIndex = this.storage.findIndex((user) => user.id === id);
    if (userIndex < 0) {
      return false;
    }
    this.storage.splice(userIndex, 1);
    return true;
  }
}
