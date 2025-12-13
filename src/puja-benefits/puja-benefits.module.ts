import { Module } from '@nestjs/common';
import { PujaBenefitsService } from './puja-benefits.service';
import { PujaBenefitsController } from './puja-benefits.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [PujaBenefitsController],
  providers: [PujaBenefitsService],
})
export class PujaBenefitsModule {}
