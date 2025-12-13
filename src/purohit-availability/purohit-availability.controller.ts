import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { PurohitAvailabilityService } from './purohit-availability.service';

import { AddAvailabilityDto } from './dto/add-availability.dto';
import { BlockDateDto } from './dto/block-date.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../auth/decorators/public.decorator';



@ApiTags('Purohit Availability')
@Controller('purohit-availability')
export class PurohitAvailabilityController {
  constructor(private service: PurohitAvailabilityService) {}

  // ⭐ PUROHIT ADD
  @Roles('PUROHIT')
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('add')
  add(@Req() req, @Body() dto: AddAvailabilityDto) {
    return this.service.addAvailability(req.user.sub, dto);
  }

  // 🚫 BLOCK DATE
  @Roles('PUROHIT')
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('block-date')
  block(@Req() req, @Body() dto: BlockDateDto) {
    return this.service.blockDate(req.user.sub, dto);
  }

  // 🔍 PUBLIC CHECK
  @Public()
  @Post('check')
  check(@Body() dto: CheckAvailabilityDto, @Req() req) {
    return this.service.checkAvailability(req.body.purohit_id, dto);
  }

  // 📅 PUROHIT CALENDAR
  @Roles('PUROHIT')
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('calendar')
  @ApiQuery({ name: 'month', example: 12 })
  @ApiQuery({ name: 'year', example: 2025 })
  getPurohitCalendar(
    @Req() req,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.service.getPurohitCalendar(
      req.user.sub,
      Number(month),
      Number(year),
    );
  }

  // 👑 ADMIN CALENDAR
  @Roles('ADMIN')
//   @UseGuards(JwtAuthGuard,RolesGuard)
  @ApiBearerAuth()
  @Get('admin/calendar')
  @ApiQuery({ name: 'month', example: 12 })
  @ApiQuery({ name: 'year', example: 2025 })
  getAdminCalendar(
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.service.getAdminCalendar(
      Number(month),
      Number(year),
    );
  }
}
