import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/abstract/abstract.entity';

export class Album extends AbstractEntity {
  @ApiProperty({ example: 'Innuendo' })
  name: string;
  @ApiProperty({ example: 1991 })
  year: number;
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
    nullable: true,
  })
  artistId: string | null;
}
