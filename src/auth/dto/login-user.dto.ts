import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'TestUser' })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ example: 'test-password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
