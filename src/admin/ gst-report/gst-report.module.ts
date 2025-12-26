import { Module } from '@nestjs/common';
import { GstReportController } from './gst-report.controller';
import { GstReportService } from './gst-report.service';
import { SupabaseModule } from '../../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [GstReportController], // 🔥 MUST
  providers: [GstReportService],
})
export class GstReportModule {}
