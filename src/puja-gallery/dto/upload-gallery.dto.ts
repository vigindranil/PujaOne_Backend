import { ApiProperty } from '@nestjs/swagger';

export class UploadPujaGalleryDto {
  @ApiProperty({ example: 1, required: false })
  sort_order?: number = 1;
}
