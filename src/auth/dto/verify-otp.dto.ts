import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: '9876543210',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: '999999',
  })
  @IsNotEmpty()
  @IsString()
  otp: string;
}
