import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { InMemoryTrackStorage } from './store/track.storage';

@Module({
  controllers: [TracksController],
  providers: [
    TracksService,
    {
      provide: 'ITrackStorage',
      useClass: InMemoryTrackStorage,
    },
  ],
})
export class TracksModule {}
