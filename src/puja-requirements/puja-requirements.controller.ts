import {
  Controller, Post, Get, Patch, Delete, Param, Body, UseGuards
} from '@nestjs/common';

import { PujaRequirementsService } from './puja-requirements.service';
import { CreatePujaRequirementDto } from './dto/create-puja-requirement.dto';
import { UpdatePujaRequirementDto } from './dto/update-puja-requirement.dto';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';



@ApiTags('Puja Requirements')
@Controller('puja-requirements')
export class PujaRequirementsController {
  constructor(private readonly service: PujaRequirementsService) {}

  // ⭐ ADMIN: Add requirement to puja
  @Roles('ADMIN')
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':pujaId')
  create(@Param('pujaId') pujaId: string, @Body() dto: CreatePujaRequirementDto) {
    return this.service.create(pujaId, dto);
  }

  // ⭐ Get all requirements for a puja
  @Public()
  @Get('puja/:pujaId')
  findByPuja(@Param('pujaId') pujaId: string) {
    return this.service.findByPuja(pujaId);
  }

  // ⭐ ADMIN: Update requirement
  @Roles('ADMIN')
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePujaRequirementDto) {
    return this.service.update(id, dto);
  }

  // ⭐ ADMIN: Delete requirement
  @Roles('ADMIN')
//   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
