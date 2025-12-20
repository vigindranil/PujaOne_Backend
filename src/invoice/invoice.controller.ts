import { Controller, Get, Param, UseGuards,Req } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';


@ApiTags('Invoice')
@ApiBearerAuth()
@Controller('invoice')
export class InvoiceController {
  constructor(private service: InvoiceService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':bookingId')
 async generate(@Param('bookingId') bookingId: string) {

    return await this.service.generateInvoice(bookingId);
  }
}
