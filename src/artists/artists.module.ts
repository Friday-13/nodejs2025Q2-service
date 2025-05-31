import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { InMemoryArtistStorage } from './store/artist.storage';

@Module({
  controllers: [ArtistsController],
  providers: [
    ArtistsService,
    {
      provide: 'IArtistStorage',
      useClass: InMemoryArtistStorage,
    },
  ],
})
export class ArtistsModule {}
