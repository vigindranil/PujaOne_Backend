import { Module } from '@nestjs/common';
import { PujaItemsController } from './puja-items.controller';
import { PujaItemsService } from './puja-items.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [PujaItemsController],
  providers: [PujaItemsService],
})
export class PujaItemsModule {}
