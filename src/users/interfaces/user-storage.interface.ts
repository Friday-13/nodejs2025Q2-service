import { IAbstractStorage } from 'src/abstract/abstract-storage.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-user-password.dto';
import { User } from '../entities/user.entity';

export interface IUserStorage
  extends IAbstractStorage<User, CreateUserDto, UpdatePasswordDto> {
  getByLogin: (login: string) => Promise<User | null>;
}
