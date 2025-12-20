import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { PujaItemsService } from './puja-items.service';
import { CreatePujaItemDto } from './dto/create-puja-item.dto';

@ApiTags('Puja Items')
@Controller('puja')
export class PujaItemsController {
  constructor(private readonly svc: PujaItemsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Post(':pujaId/items')
  @ApiOperation({ summary: 'Admin: add items to a puja' })
  addItems(
    @Param('pujaId') pujaId: string,
    @Body() items: CreatePujaItemDto[],
  ) {
    return this.svc.addItems(pujaId, items);
  }
}
