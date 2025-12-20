import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    example: '9876543210',
    description: 'User mobile number',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;
}
