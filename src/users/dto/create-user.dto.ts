import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'TestUser', format: 'uuid' })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ example: 'test-password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
