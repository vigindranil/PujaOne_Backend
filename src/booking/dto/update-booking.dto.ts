import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, IsDateString, IsBoolean, IsNumber } from "class-validator";

export class UpdateBookingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  purohit_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  time_slot?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  address_meta?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  samagri_included?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  samagri_kit_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price?: number;
}
