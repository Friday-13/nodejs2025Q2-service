import { forwardRef, Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { PrismaAlbumStorage } from './store/albums.prisma.storage';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AlbumsController],
  providers: [
    AlbumsService,
    {
      provide: 'IAlbumStorage',
      useClass: PrismaAlbumStorage,
    },
  ],
  exports: [AlbumsService],
  imports: [
    PrismaModule,
    forwardRef(() => TracksModule),
    forwardRef(() => FavoritesModule),
  ],
})
export class AlbumsModule {}
