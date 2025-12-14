import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsUUID,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsArray,
  IsIn,
} from "class-validator";

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  puja_type_id: string;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty({ example: "09:00-11:00" })
  @IsString()
  time_slot: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsOptional()
  address_meta?: any;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  samagri_included?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  samagri_kit_id?: string;

  // ✅ addons
  @ApiProperty({
    required: false,
    example: [{ addon_id: "uuid", quantity: 1 }],
  })
  @IsOptional()
  @IsArray()
  addons?: {
    addon_id: string;
    quantity: number;
  }[];

  // ✅ samagri price (optional)
  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  price?: number;

  // ✅ payment mode
  @ApiProperty({ example: "CASH | ONLINE" })
  @IsIn(["CASH", "ONLINE"])
  payment_mode: "CASH" | "ONLINE";
}
