import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreatePujaItemDto {
  @ApiProperty({ example: "Kumkum", description: "Name of the puja item" })
  @IsString()
  item_name: string;

  @ApiProperty({ example: "50g", description: "Quantity needed", required: false })
  @IsOptional()
  @IsString()
  quantity?: string;

  @ApiProperty({ example: "Use fresh kumkum only", required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
