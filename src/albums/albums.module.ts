import { forwardRef, Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { InMemoryAlbumStorage } from './store/albums.storage';
import { FavoritesModule } from 'src/favorites/favorites.module';

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
  imports: [forwardRef(() => FavoritesModule)],
})
export class AlbumsModule {}
