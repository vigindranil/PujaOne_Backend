import { Controller, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GstReportService } from './gst-report.service';

@ApiTags('Admin / GST Report')
@ApiBearerAuth()
@Controller('admin/gst-report')
export class GstReportController {
  constructor(private readonly service: GstReportService) {}

  @UseGuards(JwtAuthGuard)
  @Get('monthly')
  @ApiQuery({
    name: 'from',
    example: '2025-12-01',
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'to',
    example: '2025-12-31',
    description: 'End date (YYYY-MM-DD)',
  })
  async getMonthlyReport(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!from || !to) {
      throw new BadRequestException('from and to dates are required');
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    // ✅ extract year & month from FROM date
    const year = fromDate.getFullYear();
    const month = fromDate.getMonth() + 1; // JS month is 0-based

    return this.service.getMonthlyReport(year, month);
  }
}
