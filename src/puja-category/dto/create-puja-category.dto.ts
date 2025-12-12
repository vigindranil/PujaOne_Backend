import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePujaCategoryDto {
  @ApiProperty({
    example: "Griha Pravesh",
    description: "Name of the Puja Category"
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "Puja for housewarming ceremony",
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: "https://example.com/icons/griha.png",
    required: false
  })
  @IsOptional()
  @IsString()
  icon_url?: string;

  @ApiProperty({
    example: true,
    required: false,
    description: "Whether the category is active or not"
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
