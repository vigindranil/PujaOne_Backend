import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDateString, IsOptional } from "class-validator";

export class BlockDateDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
