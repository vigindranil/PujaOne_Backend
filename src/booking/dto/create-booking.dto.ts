import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, IsDateString, IsBoolean, IsOptional, IsNumber } from "class-validator";

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty()
  @IsUUID()
  puja_type_id: string;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty({ example: "09:00-11:00" })
  @IsString()
  time_slot: string;

  @ApiProperty({ example: "Salt Lake, Sector 2, Kolkata" })
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsOptional()
  address_meta?: any;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  samagri_included?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  samagri_kit_id?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  price?: number;
}
