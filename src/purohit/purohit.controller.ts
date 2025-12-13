import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { PurohitService } from './purohit.service';
import { AdminCreatePurohitDto } from './dto/admin-create-purohit.dto';
import { UpdatePurohitDto } from './dto/update-purohit.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Purohit')
@ApiBearerAuth()
@Controller('purohit')
export class PurohitController {
  constructor(private readonly service: PurohitService) {}

  // ⭐ Admin Create Purohit
  @Roles('ADMIN')
//   @UseGuards(JwtAuthGuard)
  @Post('admin/create')
  @ApiOperation({ summary: 'Admin: Create User + Purohit in one-shot' })
  createOneShot(@Body() dto: AdminCreatePurohitDto) {
    return this.service.createOneShot(dto);
  }

  // ⭐ Public List
  @Public()
  @Get()
  @ApiOperation({ summary: 'List all Purohits' })
  findAll() {
    return this.service.findAll();
  }

  // ⭐ Single Purohit
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get Purohit details' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ⭐ Admin Update Purohit
  @Roles('ADMIN')
//   @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Admin: Update Purohit info' })
  update(@Param('id') id: string, @Body() dto: UpdatePurohitDto) {
    return this.service.update(id, dto);
  }

  // ⭐ Purohit / Admin: Update Availability
  @Roles('PUROHIT', 'ADMIN')
//   @UseGuards(JwtAuthGuard)
  @Patch(':id/availability')
  @ApiOperation({ summary: 'Purohit: Update availability' })
  updateAvailability(@Param('id') id: string, @Body() dto: UpdateAvailabilityDto) {
    if (dto.available === undefined) {
      throw new BadRequestException("Field 'available' must be true/false");
    }
    return this.service.updateAvailability(id, dto.available);
  }

  // ⭐ Upload Profile Image
  @Roles('PUROHIT', 'ADMIN')
//   @UseGuards(JwtAuthGuard)
  @Post(':id/avatar')
  @ApiOperation({ summary: 'Upload Purohit profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File, // <-- FIXED TYPE
  ) {
    if (!file) throw new BadRequestException('Image file is required');
    return this.service.uploadAvatar(id, file);
  }

  // ⭐ Get Avatar (Signed URL)
    @Public()
    @Get(':id/avatar')
    @ApiOperation({ summary: 'Get Purohit avatar (public URL)' })
    getAvatar(@Param('id') id: string) {
    return this.service.getAvatar(id);
    }
}
