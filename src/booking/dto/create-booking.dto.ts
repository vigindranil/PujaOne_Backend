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
  IsEmail,
  IsObject,
} from "class-validator";

export class CreateBookingDto {

  // =========================
  // PUJA & SLOT
  // =========================
  @ApiProperty()
  @IsUUID()
  puja_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  pricing_id?: string; // ✅ PACKAGE

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty({ example: "09:00-11:00" })
  @IsString()
  time_slot: string;

  // =========================
  // ADDRESS
  // =========================
  @ApiProperty()
  @IsObject()
  address: any;

  @ApiProperty({ required: false })
  @IsOptional()
  address_meta?: any;

  // =========================
  // CONTACT
  // =========================
  @ApiProperty()
  @IsString()
  contact_name: string;

  @ApiProperty()
  @IsString()
  contact_phone: string;

  @ApiProperty()
  @IsEmail()
  contact_email: string;

  // =========================
  // SAVE ADDRESS
  // =========================
  @IsOptional()
  @IsBoolean()
  save_address?: boolean;

  @IsOptional()
  @IsString()
  address_label?: string;

  // =========================
  // SAMAGRI
  // =========================
  @IsOptional()
  @IsBoolean()
  samagri_included?: boolean;

  @IsOptional()
  @IsUUID()
  samagri_kit_id?: string;

  // =========================
  // CUSTOM ADDONS
  // =========================
  @IsOptional()
  @IsArray()
  addons?: {
    addon_id: string;
    quantity: number;
  }[];

  // =========================
  // PAYMENT
  // =========================
  @ApiProperty({ example: "CASH | ONLINE" })
  @IsIn(["CASH", "ONLINE"])
  payment_mode: "CASH" | "ONLINE";
}
