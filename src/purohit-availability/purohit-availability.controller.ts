import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";

import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/guards/roles.decorator";

import { PurohitAvailabilityService } from "./purohit-availability.service";
import { AddAvailabilityDto } from "./dto/add-availability.dto";
import { BlockDateDto } from "./dto/block-date.dto";
import { CheckAvailabilityDto } from "./dto/check-availability.dto";

@ApiTags("Purohit Availability")
@Controller("purohit-availability")
export class PurohitAvailabilityController {
  constructor(private service: PurohitAvailabilityService) {}

  // ⭐ Purohit adds available slots
  @Roles("PUROHIT")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("add")
  add(@Body() dto: AddAvailabilityDto, @Req() req) {
    return this.service.addAvailability(req.user.sub, dto);
  }

  // ⭐ Purohit blocks date (leave/travel)
  @Roles("PUROHIT")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("block")
  block(@Body() dto: BlockDateDto, @Req() req) {
    return this.service.blockDate(req.user.sub, dto);
  }

  // ⭐ Check availability for date + slot
  @Post("check")
  check(@Body() dto: CheckAvailabilityDto) {
    return this.service.check(dto);
  }
}
