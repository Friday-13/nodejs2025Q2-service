import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaUserStorage } from './store/user.prisma.storage';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserStorage',
      useClass: PrismaUserStorage,
    },
  ],
  imports: [PrismaModule],
})
export class UsersModule {}
