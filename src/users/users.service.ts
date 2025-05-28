import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
import { InMemoryUserStorage } from './store/user.storage';

@Injectable()
export class UsersService {
  constructor(private storage: InMemoryUserStorage) {}

  create(dto: CreateUserDto) {
    return this.storage.create(dto);
  }

  findAll() {
    return this.storage.getAll();
  }

  findOne(id: string) {
    return this.storage.getById(id);
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    return this.storage.updatePassword(id, updatePasswordDto);
  }

  remove(id: string) {
    return this.storage.remove(id);
  }
}
