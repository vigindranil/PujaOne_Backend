import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { PujaPricingService } from './puja-pricing.service';
import { CreatePricingOptionDto } from './dto/create-pricing.dto';
import { UpdatePricingOptionDto } from './dto/update-pricing.dto';

@ApiTags("Puja Pricing")
@Controller("puja-pricing")
export class PujaPricingController {
  constructor(private service: PujaPricingService) {}

  // admin create pricing option
  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("admin/:puja_id")
  create(@Param("puja_id") puja_id: string, @Body() dto: CreatePricingOptionDto) {
    return this.service.create(puja_id, dto);
  }

  // public list pricing options for puja
  @Get(":puja_id")
  findAll(@Param("puja_id") puja_id: string) {
    return this.service.findAll(puja_id);
  }

  // update
  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch("admin/:id")
  update(@Param("id") id: string, @Body() dto: UpdatePricingOptionDto) {
    return this.service.update(id, dto);
  }

  // delete
  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete("admin/:id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
