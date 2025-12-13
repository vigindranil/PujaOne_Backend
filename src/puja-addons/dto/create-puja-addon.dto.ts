import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreatePujaAddonDto {
  @ApiProperty()
  @IsString()
  puja_id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  is_required?: boolean = false;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  sort_order?: number = 1;
}
