import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class AdminCreatePurohitDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNumber()
  experienceYears: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  languages: string[];

  @ApiProperty()
  @IsString()
  specialization: string;

  @ApiProperty()
  @IsString()
  bio: string;
}
