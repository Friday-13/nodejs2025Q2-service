import { forwardRef, Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { InMemoryArtistStorage } from './store/artist.storage';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  controllers: [ArtistsController],
  providers: [
    ArtistsService,
    {
      provide: 'IArtistStorage',
      useClass: InMemoryArtistStorage,
    },
  ],
  imports: [forwardRef(() => FavoritesModule)],
  exports: [ArtistsService],
})
export class ArtistsModule {}
