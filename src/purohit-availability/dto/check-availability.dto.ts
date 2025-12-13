import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CheckAvailabilityDto {
  @ApiProperty({ example: '2025-12-20' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '06:00-08:00' })
  @IsString()
  time_slot: string;
}
