import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryPurohitDto {
  @ApiPropertyOptional({ description: 'Search by name or specialization' }) @IsOptional() @IsString() q?: string;
  @ApiPropertyOptional({ description: 'Language filter' }) @IsOptional() @IsString() language?: string;
  @ApiPropertyOptional({ description: 'page number' }) @IsOptional() @IsNumberString() page?: string;
  @ApiPropertyOptional({ description: 'page size' }) @IsOptional() @IsNumberString() pageSize?: string;
  @ApiPropertyOptional({ description: 'min rating' }) @IsOptional() @IsNumberString() minRating?: string;
}
