import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsArray, IsOptional, IsNumber } from "class-validator";

export class CalculatePriceDto {
  @ApiProperty()
  @IsUUID()
  puja_type_id: string;

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

  // 🔥 ADD THIS (THIS FIXES YOUR ERROR)
  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  samagri_price?: number;
}
