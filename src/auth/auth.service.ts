import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import InvalidCredentials from './errors/invalid-credentials.error';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async login(login: string, password: string) {
    const user = await this.userService.getByLogin(login);
    if (user.password !== password) {
      throw new InvalidCredentials();
    }
    return user;
  }
}
