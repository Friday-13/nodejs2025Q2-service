import { forwardRef, Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { PrismaArtistStorage } from './store/artist.prisma.storage';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ArtistsController],
  providers: [
    ArtistsService,
    {
      provide: 'IArtistStorage',
      useClass: PrismaArtistStorage,
    },
  ],
  imports: [
    PrismaModule,
    forwardRef(() => FavoritesModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
  ],
  exports: [ArtistsService],
})
export class ArtistsModule {}
