import { Module } from '@nestjs/common';
import { PujaGalleryService } from './puja-gallery.service';
import { PujaGalleryController } from './puja-gallery.controller';

@Module({
  providers: [PujaGalleryService],
  controllers: [PujaGalleryController],
})
export class PujaGalleryModule {}
