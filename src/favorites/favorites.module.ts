import { forwardRef, Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TracksModule } from 'src/tracks/tracks.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { PrismaFavoritesStorage } from './store/favorites.prisma.storage';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    {
      provide: 'IFavoritesStorage',
      useClass: PrismaFavoritesStorage,
    },
  ],
  imports: [
    PrismaModule,
    forwardRef(() => TracksModule),
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
  ],
  exports: [FavoritesService],
})
export class FavoritesModule {}
