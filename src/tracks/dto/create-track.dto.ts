import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({ example: 'Bohemian Rhapsody' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  artistId: string | null; // refers to Artist

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  albumId: string | null; // refers to Album

  @ApiProperty({
    example: 262,
    description: 'In seconds',
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number; // integer number
}
