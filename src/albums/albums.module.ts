import { forwardRef, Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { InMemoryAlbumStorage } from './store/albums.storage';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  controllers: [AlbumsController],
  providers: [
    AlbumsService,
    {
      provide: 'IAlbumStorage',
      useClass: InMemoryAlbumStorage,
    },
  ],
  exports: [AlbumsService],
  imports: [forwardRef(() => TracksModule), forwardRef(() => FavoritesModule)],
})
export class AlbumsModule {}
