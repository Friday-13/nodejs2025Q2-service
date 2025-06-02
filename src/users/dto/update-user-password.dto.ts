import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'test-password' })
  @IsNotEmpty()
  @IsString()
  oldPassword: string; // previous password

  @ApiProperty({ example: 'new-password' })
  @IsNotEmpty()
  @IsString()
  newPassword: string; // new password
}
