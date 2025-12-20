import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from '../auth/guards/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { PujaPricingService } from './puja-pricing.service';
import { CreatePricingOptionDto } from './dto/create-pricing.dto';
import { UpdatePricingOptionDto } from './dto/update-pricing.dto';

@ApiTags('Puja Pricing')
@Controller('puja-pricing')
export class PujaPricingController {
  constructor(private readonly service: PujaPricingService) {}

  // PRICING CRUD
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Post('admin/:puja_id')
  create(
    @Param('puja_id') puja_id: string,
    @Body() dto: CreatePricingOptionDto,
  ) {
    return this.service.create(puja_id, dto);
  }

  @Public()
  @Get(':puja_id')
  findAll(@Param('puja_id') puja_id: string) {
    return this.service.findAll(puja_id);
  }

  @Roles('ADMIN')
  @ApiBearerAuth()
  @Patch('admin/:id')
  update(@Param('id') id: string, @Body() dto: UpdatePricingOptionDto) {
    return this.service.update(id, dto);
  }

  @Roles('ADMIN')
  @ApiBearerAuth()
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // PACKAGE → ADDON
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Post('admin/:pricingId/addons/:addonId')
  addAddon(
    @Param('pricingId') pricingId: string,
    @Param('addonId') addonId: string,
  ) {
    return this.service.addAddonToPackage(pricingId, addonId);
  }

  @Roles('ADMIN')
  @ApiBearerAuth()
  @Delete('admin/:pricingId/addons/:addonId')
  removeAddon(
    @Param('pricingId') pricingId: string,
    @Param('addonId') addonId: string,
  ) {
    return this.service.removeAddonFromPackage(pricingId, addonId);
  }

  @Public()
  @Get(':pricingId/addons')
  getAddons(@Param('pricingId') pricingId: string) {
    return this.service.getPackageAddons(pricingId);
  }

  // PACKAGE → REQUIREMENT
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Post('admin/:pricingId/requirements/:requirementId')
  addRequirement(
    @Param('pricingId') pricingId: string,
    @Param('requirementId') requirementId: string,
  ) {
    return this.service.addRequirementToPackage(
      pricingId,
      requirementId,
    );
  }

  @Roles('ADMIN')
  @ApiBearerAuth()
  @Delete('admin/:pricingId/requirements/:requirementId')
  removeRequirement(
    @Param('pricingId') pricingId: string,
    @Param('requirementId') requirementId: string,
  ) {
    return this.service.removeRequirementFromPackage(
      pricingId,
      requirementId,
    );
  }

  @Public()
  @Get(':pricingId/requirements')
  getRequirements(@Param('pricingId') pricingId: string) {
    return this.service.getPackageRequirements(pricingId);
  }
}
