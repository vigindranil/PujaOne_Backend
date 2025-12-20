import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreatePujaDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  short_description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  long_description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  base_price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  duration_minutes?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
