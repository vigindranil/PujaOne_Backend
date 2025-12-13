import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';

import { PujaAddonsService } from './puja-addons.service';
import { CreatePujaAddonDto } from './dto/create-puja-addon.dto';
import { UpdatePujaAddonDto } from './dto/update-puja-addon.dto';
import { Public } from '../auth/decorators/public.decorator';
@ApiTags("Puja Addons")
@Controller("puja-addons")
export class PujaAddonsController {
  constructor(private service: PujaAddonsService) {}

  // ⭐ PUBLIC LIST
  @Public()
  @Get(":puja_id")
  findAll(@Param("puja_id") puja_id: string) {
    return this.service.findAll(puja_id);
  }

  // ⭐ ADMIN CREATE
  @Roles("ADMIN")
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("admin")
  create(@Body() dto: CreatePujaAddonDto) {
    return this.service.create(dto);
  }

  // ⭐ ADMIN UPDATE
  @Roles("ADMIN")
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch("admin/:id")
  update(@Param("id") id: string, @Body() dto: UpdatePujaAddonDto) {
    return this.service.update(id, dto);
  }

  // ⭐ ADMIN DELETE
  @Roles("ADMIN")
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete("admin/:id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
