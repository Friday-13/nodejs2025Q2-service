import { ApiProperty } from '@nestjs/swagger';

export class Favorite {
  @ApiProperty({
    example: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
    format: 'uuid',
    isArray: true,
  })
  tracks: string[];

  @ApiProperty({
    example: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
    format: 'uuid',
    isArray: true,
  })
  albums: string[];

  @ApiProperty({
    example: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
    format: 'uuid',
    isArray: true,
  })
  artists: string[];
}
