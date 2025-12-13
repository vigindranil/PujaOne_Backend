import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";

import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { SamagriKitsService } from "./samagri-kits.service";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/guards/roles.decorator";

import { CreateSamagriKitDto } from "./dto/create-kit.dto";
import { UpdateSamagriKitDto } from "./dto/update-kit.dto";
import { AddKitItemDto } from "./dto/add-kit-item.dto";
import { UpdateKitItemDto } from "./dto/update-kit-item.dto";
import { Public } from "../auth/decorators/public.decorator";



@ApiTags("Samagri Kits")
@Controller("samagri-kits")
export class SamagriKitsController {
  constructor(private service: SamagriKitsService) {}

  // ⭐ Admin create kit
  @Roles("ADMIN")
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("admin/create")
  create(@Body() dto: CreateSamagriKitDto) {
    return this.service.create(dto);
  }

  // ⭐ Public kits for puja
  @Public()
  @Get(":puja_id")
  getKits(@Param("puja_id") puja_id: string) {
    return this.service.findByPuja(puja_id);
  }

  // ⭐ Admin update kit
  @Roles("ADMIN")
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch("admin/:id")
  update(@Param("id") id: string, @Body() dto: UpdateSamagriKitDto) {
    return this.service.update(id, dto);
  }

  // ⭐ Admin delete kit
  @Roles("ADMIN")
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete("admin/:id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }

  // ⭐ Add item inside kit
  @Roles("ADMIN")
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("admin/add-item")
  addItem(@Body() dto: AddKitItemDto) {
    return this.service.addItem(dto);
  }

  // ⭐ Update item
  @Roles("ADMIN")
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch("admin/item/:id")
  updateItem(@Param("id") id: string, @Body() dto: UpdateKitItemDto) {
    return this.service.updateItem(id, dto);
  }

  // ⭐ Delete item
  @Roles("ADMIN")
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete("admin/item/:id")
  removeItem(@Param("id") id: string) {
    return this.service.removeItem(id);
  }
}
