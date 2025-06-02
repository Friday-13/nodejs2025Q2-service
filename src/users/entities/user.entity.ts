import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  id: string; // uuid v4
  @ApiProperty({ example: 'TestUser' })
  login: string;
  password: string;
  @ApiProperty({
    example: 1,
    description: 'Entity version. Auto-incremented on each update',
  })
  version: number; // integer number, increments on update
  @ApiProperty({ example: 1655000000 })
  createdAt: number; // timestamp of creation
  @ApiProperty({ example: 1655000000 })
  updatedAt: number; // timestamp of last update
}
