import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ example: 'Innuendo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1991,
  })
  @IsNumber()
  @IsNotEmpty()
  year: number; // integer number

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  artistId: string | null; // refers to Artist
}
