import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty() @IsNotEmpty() name: string;
  @ApiProperty() @IsNotEmpty() phone: string;
  @ApiProperty() @IsNotEmpty() @MinLength(6) password: string;
  @ApiProperty({ required: false }) role?: string;
}
