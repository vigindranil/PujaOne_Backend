import { Module } from '@nestjs/common';
import { PujaItemsService } from './puja-items.service';
import { PujaItemsController } from './puja-items.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [PujaItemsController],
  providers: [PujaItemsService],
})
export class PujaItemsModule {}
