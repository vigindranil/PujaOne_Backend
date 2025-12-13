import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePujaBenefitDto {
  @ApiProperty({ example: "Removes negative energy" })
  @IsString()
  title: string;

  @ApiProperty({ example: "This puja brings peace, prosperity and removes Vastu dosh", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  sort_order?: number = 1;
}
