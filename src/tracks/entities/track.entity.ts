import { ApiProperty } from '@nestjs/swagger';

export class Track {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  id: string; // uuid v4
  @ApiProperty({ example: 'Bohemian Rhapsody' })
  name: string;
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
    nullable: true,
  })
  artistId: string | null; // refers to Artist
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
    nullable: true,
  })
  albumId: string | null; // refers to Album
  @ApiProperty({
    example: 355,
    description: 'In seconds',
  })
  duration: number; // integer number
}
