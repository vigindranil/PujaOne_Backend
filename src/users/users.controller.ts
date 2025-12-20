import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Put,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  // =========================
  // 👤 GET MY PROFILE
  // =========================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get logged-in user profile' })
  async me(@Req() req: any) {
    // 🔥 JWT user id = sub
    return this.svc.findById(req.user.id);
  }

  // =========================
  // ✏️ COMPLETE / UPDATE PROFILE
  // =========================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('me/profile')
  @ApiOperation({ summary: 'Complete or update user profile' })
  async updateMyProfile(
    @Req() req: any,
    @Body() dto: UpdateProfileDto,
  ) {
    // 🔥 IMPORTANT: req.user.id
    return this.svc.updateProfile(req.user.id, dto);
  }

  // =========================
  // 📍 GET MY SAVED ADDRESSES
  // =========================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me/addresses')
  @ApiOperation({ summary: 'Get my saved addresses' })
  async getMyAddresses(@Req() req: any) {
    return this.svc.getMyAddresses(req.user.id);
  }

  // =========================
  // 🔍 GET USER BY ID (ADMIN / INTERNAL)
  // =========================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getById(@Param('id') id: string) {
    return this.svc.findById(id);
  }
}
