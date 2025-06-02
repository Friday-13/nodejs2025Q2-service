import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/abstract/abstract.entity';

export class Artist extends AbstractEntity {
  @ApiProperty({ example: 'Freddie Mercury' })
  name: string;

  @ApiProperty({ example: false })
  grammy: boolean;
}
