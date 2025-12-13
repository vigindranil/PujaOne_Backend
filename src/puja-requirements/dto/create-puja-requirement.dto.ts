import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreatePujaRequirementDto {
  @ApiProperty({ example: "Ghee" })
  @IsString()
  item_name: string;

  @ApiProperty({ example: "250 ml", required: false })
  @IsOptional()
  @IsString()
  quantity?: string;

  @ApiProperty({ example: "Pure cow ghee only", required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
