import { IsUUID, IsDateString, IsArray, IsString } from 'class-validator';

export class AddAvailabilityDto {
  @IsUUID()
  purohit_id: string;

  @IsDateString()
  date: string;

  @IsArray()
  @IsString({ each: true })
  time_slots: string[];
}
