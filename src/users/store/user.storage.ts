import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-user-password.dto';
import { InMemoryAbstractStorage } from 'src/abstract/abstract-in-memory.storage';

@Injectable()
export class InMemoryUserStorage extends InMemoryAbstractStorage<
  User,
  CreateUserDto,
  UpdatePasswordDto
> {
  async create(dto: CreateUserDto) {
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

  async update(id: string, dto: UpdatePasswordDto) {
    const user = await this.getById(id);
    if (!user) {
      return null;
    }
    user.password = dto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return user;
  }
}
