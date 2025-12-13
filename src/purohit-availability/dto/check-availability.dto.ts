import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDateString } from "class-validator";

export class CheckAvailabilityDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  time_slot: string;
}
