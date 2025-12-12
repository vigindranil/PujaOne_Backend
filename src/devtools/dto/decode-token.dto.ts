import { ApiProperty } from '@nestjs/swagger';

export class DecodeTokenDto {
  @ApiProperty({ description: 'JWT Access Token' })
  token: string;
}
