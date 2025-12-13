import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNumber } from "class-validator";

export class AddAddonDto {
  @ApiProperty()
  @IsUUID()
  addon_id: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}
