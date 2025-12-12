import { Module } from '@nestjs/common';
import { PujasController } from './puja.controller';
import { PujasService } from './pujas.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [PujasController],
  providers: [PujasService],
})
export class PujaModule {}
