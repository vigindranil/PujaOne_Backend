import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsString, IsOptional } from "class-validator";

export class AddKitItemDto {
  @ApiProperty()
  @IsUUID()
  kit_id: string;

  @ApiProperty()
  @IsString()
  item_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  quantity?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
