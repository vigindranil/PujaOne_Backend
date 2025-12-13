import { Controller, Post, Patch, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { PujaBenefitsService } from './puja-benefits.service';
import { CreatePujaBenefitDto } from './dto/create-puja-benefit.dto';
import { UpdatePujaBenefitDto } from './dto/update-puja-benefit.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';

@ApiTags("Puja Benefits")
@Controller("puja-benefits")
export class PujaBenefitsController {
  constructor(private service: PujaBenefitsService) {}

  // ⭐ Admin: Create benefit
  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("admin/:puja_id")
  create(
    @Param("puja_id") puja_id: string,
    @Body() dto: CreatePujaBenefitDto
  ) {
    return this.service.create(puja_id, dto);
  }

  // ⭐ Public: Get all benefits
  @Get(":puja_id")
  findAll(@Param("puja_id") puja_id: string) {
    return this.service.findAll(puja_id);
  }

  // ⭐ Admin: Update
  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch("admin/:id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdatePujaBenefitDto
  ) {
    return this.service.update(id, dto);
  }

  // ⭐ Admin: Delete
  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete("admin/:id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
