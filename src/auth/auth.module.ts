import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, LoggingModule],
})
export class AuthModule {}
