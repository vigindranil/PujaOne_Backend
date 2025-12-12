import { Controller, Get, Query, Param, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PujasService } from './pujas.service';
import { CreatePujaDto } from './dto/create-puja.dto';
import { UpdatePujaDto } from './dto/update-puja.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';

@ApiTags('Puja')
@Controller('puja')
export class PujasController {
  constructor(private svc: PujasService) {}

  @Get()
  @ApiOperation({ summary: 'List pujas' })
  list(
    @Query('limit') limit = '20',
    @Query('offset') offset = '0',
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('featured') featured?: string,
  ) {
    return this.svc.list({
      limit: Number(limit),
      offset: Number(offset),
      category,
      search,
      featured: featured === 'true'
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get puja by id' })
  getOne(@Param('id') id: string) {
    return this.svc.getOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Post('admin/create')
  @ApiOperation({ summary: 'Admin: create puja' })
  create(@Body() dto: CreatePujaDto) {
    return this.svc.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Patch('admin/:id')
  @ApiOperation({ summary: 'Admin: update puja' })
  update(@Param('id') id: string, @Body() dto: UpdatePujaDto) {
    return this.svc.update(id, dto);
  }
}
