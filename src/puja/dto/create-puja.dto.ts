import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsUUID, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PujaItemDto {
  @ApiProperty()
  @IsString()
  item_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  quantity?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

class PujaAddonDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  price: number;
}

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

  @ApiProperty({ required: false, type: [PujaItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PujaItemDto)
  items?: PujaItemDto[];

  @ApiProperty({ required: false, type: [PujaAddonDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PujaAddonDto)
  addons?: PujaAddonDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
