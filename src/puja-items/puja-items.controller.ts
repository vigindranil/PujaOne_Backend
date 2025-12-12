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

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';

import { PujaItemsService } from './puja-items.service';
import { CreatePujaItemDto } from './dto/create-puja-item.dto';
import { UpdatePujaItemDto } from './dto/update-puja-item.dto';

@ApiTags("Puja Items")
@Controller("puja-items")
export class PujaItemsController {
  constructor(private readonly service: PujaItemsService) {}

  // ⭐ Admin: Add item to puja
  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("admin/:puja_id")
  create(
    @Param("puja_id") puja_id: string,
    @Body() dto: CreatePujaItemDto
  ) {
    return this.service.create(puja_id, dto);
  }

  // ⭐ Public: Get items for puja
  @Get("puja/:puja_id")
  findByPuja(@Param("puja_id") puja_id: string) {
    return this.service.findByPuja(puja_id);
  }

  // ⭐ Admin: Update item
  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch("admin/:id")
  update(@Param("id") id: string, @Body() dto: UpdatePujaItemDto) {
    return this.service.update(id, dto);
  }

  // ⭐ Admin: Delete item
  @Roles("ADMIN")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete("admin/:id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
