import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-user-password.dto';
import { User } from '../entities/user.entity';

export interface IUserStorage {
  getAll: () => User[];
  getById: (id: string) => User | null;
  create: (dto: CreateUserDto) => User;
  updatePassword: (id: string, dto: UpdatePasswordDto) => User | null;
  remove: (id: string) => boolean;
}
