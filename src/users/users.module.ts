import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { InMemoryUserStorage } from './store/user.storage';

@Module({
  controllers: [UsersController],
  providers: [UsersService, InMemoryUserStorage],
})
export class UsersModule {}
