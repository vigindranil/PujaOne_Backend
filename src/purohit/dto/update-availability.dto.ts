import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateAvailabilityDto {
  @ApiProperty({
    example: true,
    description: 'Whether the Purohit is available for bookings',
    type: Boolean
  })
  @IsBoolean()
  available: boolean;
}
