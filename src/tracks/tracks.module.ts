import { forwardRef, Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { PrismaTrackStorage } from './store/track.prisma.storage';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [TracksController],
  providers: [
    TracksService,
    {
      provide: 'ITrackStorage',
      useClass: PrismaTrackStorage,
    },
  ],
  imports: [PrismaModule, forwardRef(() => FavoritesModule)],
  exports: [TracksService],
})
export class TracksModule {}
