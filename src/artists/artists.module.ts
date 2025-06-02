import { forwardRef, Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { InMemoryArtistStorage } from './store/artist.storage';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  controllers: [ArtistsController],
  providers: [
    ArtistsService,
    {
      provide: 'IArtistStorage',
      useClass: InMemoryArtistStorage,
    },
  ],
  imports: [
    forwardRef(() => FavoritesModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
  ],
  exports: [ArtistsService],
})
export class ArtistsModule {}
