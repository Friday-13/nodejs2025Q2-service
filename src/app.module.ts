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
import configs from './configs';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configs], isGlobal: true }),
    UsersModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
