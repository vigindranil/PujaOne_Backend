import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { PujasService } from './pujas.service';
import { CreatePujaDto } from './dto/create-puja.dto';
import { UpdatePujaDto } from './dto/update-puja.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import {
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/cache-manager';

@ApiTags('Puja')
@Controller('puja')
export class PujasController {
  constructor(private readonly svc: PujasService) {}

  // ------------------------------------------------
  // 🟢 PUBLIC: LIGHTWEIGHT PUJA LIST (HOME / SEARCH)
  // ------------------------------------------------
  @UseInterceptors(CacheInterceptor)
  @Public()
  @Get()
  @ApiOperation({ summary: 'List pujas (lightweight list)' })
  list(
    @Query('limit') limit = '20',
    @Query('offset') offset = '0',
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('featured') featured?: string,
  ) {
    return this.svc.list({
      limit: Number(limit),
      offset: Number(offset),
      category,
      search,
      featured: featured === 'true',
    });
  }

  // ------------------------------------------------
  // 🔥 PUBLIC: FULL PUJA DETAILS (AGGREGATED)
  // puja_id OR category_id (any one required)
  // ------------------------------------------------
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // 5 minutes
  @Public()
  @Get('details')
  @ApiOperation({
    summary: 'Get full puja details by puja_id OR category_id',
  })
  @ApiQuery({
    name: 'puja_id',
    required: false,
    type: String,
    description: 'Provide puja_id to get a single puja with full details',
  })
  @ApiQuery({
    name: 'category_id',
    required: false,
    type: String,
    description:
      'Provide category_id to get all pujas under this category with full details',
  })
  getDetails(
    @Query('puja_id') pujaId?: string,
    @Query('category_id') categoryId?: string,
  ) {
    return this.svc.getPujaDetails({ pujaId, categoryId });
  }

  // ------------------------------------------------
  // 🔐 ADMIN: CREATE PUJA (BASIC INFO ONLY)
  // ------------------------------------------------
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Post('admin/create')
  @ApiOperation({
    summary: 'Admin: create puja (basic info only)',
  })
  create(@Body() dto: CreatePujaDto) {
    return this.svc.create(dto);
  }

  // ------------------------------------------------
  // 🔐 ADMIN: UPDATE PUJA
  // ------------------------------------------------
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Patch('admin/:id')
  @ApiOperation({
    summary: 'Admin: update puja',
  })
  update(@Param('id') id: string, @Body() dto: UpdatePujaDto) {
    return this.svc.update(id, dto);
  }
}
