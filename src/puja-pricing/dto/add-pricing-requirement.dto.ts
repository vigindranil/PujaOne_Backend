import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddPricingRequirementDto {
  @ApiProperty({ example: 'requirement-uuid' })
  @IsUUID()
  requirement_id: string;
}
