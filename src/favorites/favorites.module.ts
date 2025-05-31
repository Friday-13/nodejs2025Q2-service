import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { ImMemoryFavoritesStorage } from './store/favorites.storage';
import { TracksModule } from 'src/tracks/tracks.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { AlbumsModule } from 'src/albums/albums.module';

@Module({
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    {
      provide: 'IFavoritesStorage',
      useClass: ImMemoryFavoritesStorage,
    },
  ],
  imports: [TracksModule, ArtistsModule, AlbumsModule],
})
export class FavoritesModule {}
