import { Controller, Post, Get, Delete, Param, Body, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { PujaGalleryService } from './puja-gallery.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags("Puja Gallery")
@Controller("puja-gallery")
export class PujaGalleryController {
  constructor(private service: PujaGalleryService) {}

  // ⭐ Admin upload image
  @Roles("ADMIN")
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("admin/:puja_id")
  @UseInterceptors(FileInterceptor("image"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
        sort_order: { type: 'number' }
      }
    }
  })
  upload(
    @Param("puja_id") puja_id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body("sort_order") sort_order: number,
  ) {
    return this.service.upload(puja_id, file, Number(sort_order) || 1);
  }
  @Public()
  // ⭐ Public list
  @Get(":puja_id")
  findAll(@Param("puja_id") puja_id: string) {
    return this.service.findAll(puja_id);
  }

  // ⭐ Admin delete
  @Roles("ADMIN")
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete("admin/:id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
