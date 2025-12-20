import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { PujaAddonsService } from './puja-addons.service';
import { CreatePujaAddonDto } from './dto/create-puja-addon.dto';

@ApiTags('Puja Addons')
@Controller('puja')
export class PujaAddonsController {
  constructor(private readonly svc: PujaAddonsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Post(':pujaId/addons')
  @ApiOperation({ summary: 'Admin: add addons to a puja' })
  addAddons(
    @Param('pujaId') pujaId: string,
    @Body() addons: CreatePujaAddonDto[],
  ) {
    return this.svc.addAddons(pujaId, addons);
  }
}
