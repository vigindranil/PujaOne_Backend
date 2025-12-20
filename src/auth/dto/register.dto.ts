import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Indranil Sharma' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '9876543210' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '******', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // 🔥 OPTIONAL EMAIL (for invoice / receipt)
  @ApiProperty({
    required: false,
    example: 'user@example.com',
    description: 'Optional email for invoice & receipt',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  // 🔐 OPTIONAL ROLE (ADMIN / USER)
  @ApiProperty({ required: false })
  @IsOptional()
  role?: string;
}
