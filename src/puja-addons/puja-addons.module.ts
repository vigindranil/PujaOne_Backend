import { Module } from '@nestjs/common';
import { PujaAddonsController } from './puja-addons.controller';
import { PujaAddonsService } from './puja-addons.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [PujaAddonsController],
  providers: [PujaAddonsService],
})
export class PujaAddonsModule {}
