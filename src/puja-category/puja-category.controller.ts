import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { PujaCategoryService } from './puja-category.service';
import { CreatePujaCategoryDto } from './dto/create-puja-category.dto';
import { UpdatePujaCategoryDto } from './dto/update-puja-category.dto';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';

@ApiTags('Puja Categories')
@Controller('puja-category')
export class PujaCategoryController {
  constructor(private readonly service: PujaCategoryService) {}

  // ⭐ Admin create
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreatePujaCategoryDto) {
    return this.service.create(dto);
  }

  // ⭐ Public list
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ⭐ Public get one
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ⭐ Admin update
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePujaCategoryDto) {
    return this.service.update(id, dto);
  }

  // ⭐ Admin delete
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
