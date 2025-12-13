import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreatePricingOptionDto {
  @ApiProperty({ example: "Premium Package" })
  @IsString()
  title: string;

  @ApiProperty({ example: "Includes extra rituals and 2 purohits", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2500 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  sort_order?: number = 1;
}
