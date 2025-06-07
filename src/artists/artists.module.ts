import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
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
  imports: [PrismaModule],
  exports: [ArtistsService],
})
export class ArtistsModule {}
