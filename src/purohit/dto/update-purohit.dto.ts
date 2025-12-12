import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePurohitDto {
  @ApiPropertyOptional() name?: string;
  @ApiPropertyOptional() experienceYears?: number;
  @ApiPropertyOptional({ type: [String] }) languages?: string[];
  @ApiPropertyOptional() specialization?: string;
  @ApiPropertyOptional() bio?: string;
  @ApiPropertyOptional() profileImageUrl?: string;
}
