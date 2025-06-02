import { forwardRef, Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { InMemoryTrackStorage } from './store/track.storage';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  controllers: [TracksController],
  providers: [
    TracksService,
    {
      provide: 'ITrackStorage',
      useClass: InMemoryTrackStorage,
    },
  ],
  imports: [forwardRef(() => FavoritesModule)],
  exports: [TracksService],
})
export class TracksModule {}
