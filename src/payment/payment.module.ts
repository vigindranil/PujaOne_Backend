import { Module } from '@nestjs/common';
import { PaymentsController } from './payment.controller';
import { PaymentService } from './payment.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [
    SupabaseModule, // 🔥 PaymentService uses Supabase
  ],
  controllers: [PaymentsController],
  providers: [PaymentService],
  exports: [PaymentService], // 👈 future use (optional but good)
})
export class PaymentsModule {}
