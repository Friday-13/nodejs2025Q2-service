import { ApiProperty } from '@nestjs/swagger';
import { albumsExample, artistsExample, tracksExample } from 'examples.doc';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';

export class ResponseFavoritesDto {
  @ApiProperty({ example: artistsExample })
  artists: Artist[];
  @ApiProperty()
  @ApiProperty({ example: albumsExample })
  albums: Album[];
  @ApiProperty({ example: tracksExample })
  tracks: Track[];
}
