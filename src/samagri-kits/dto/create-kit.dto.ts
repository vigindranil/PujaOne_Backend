import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, IsNumber, IsOptional, IsBoolean } from "class-validator";

export class CreateSamagriKitDto {
  @ApiProperty()
  @IsUUID()
  puja_id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}
