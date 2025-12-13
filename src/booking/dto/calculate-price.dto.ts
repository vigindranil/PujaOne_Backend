import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsArray, IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class AddonSelection {
  @ApiProperty()
  @IsUUID()
  addon_id: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class CalculatePriceDto {
  @ApiProperty()
  @IsUUID()
  puja_type_id: string;

  @ApiProperty({ type: [AddonSelection] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddonSelection)
  addons: AddonSelection[];
}
