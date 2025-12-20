import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { EmailModule } from '../email/email.module'; // ⭐ ADD THIS

@Module({
  imports: [
    SupabaseModule,
    EmailModule, // ⭐ VERY IMPORTANT
  ],
  providers: [InvoiceService],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
