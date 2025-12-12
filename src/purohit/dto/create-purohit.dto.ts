import { ApiProperty } from '@nestjs/swagger';

export class CreatePurohitDto {
  @ApiProperty() name: string;

  @ApiProperty() experienceYears: number;

  @ApiProperty({ type: [String] }) languages: string[];

  @ApiProperty() specialization: string;

  @ApiProperty() bio: string;
}
