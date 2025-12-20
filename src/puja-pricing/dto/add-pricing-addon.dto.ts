import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddPricingAddonDto {
  @ApiProperty({ example: 'addon-uuid' })
  @IsUUID()
  addon_id: string;
}
