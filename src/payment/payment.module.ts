import { Module } from '@nestjs/common';
import { PaymentsController } from './payment.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
