import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsArray, IsDateString } from "class-validator";

export class AddAvailabilityDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty({ example: ["06:00-08:00", "08:00-10:00"] })
  @IsArray()
  time_slots: string[];
}
