import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { LoggingService } from './logging/logging.service';
import configs from './configs';
import { LoggingModule } from './logging/logging.module';
import { ExceptionFiltersModule } from './exception-filters/exception-filters.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configs], isGlobal: true }),
    LoggingModule,
    AuthModule,
    UsersModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
    PrismaModule,
    ExceptionFiltersModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggingService],
})
export class AppModule {}
