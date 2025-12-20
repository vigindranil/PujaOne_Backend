import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { ProfileCompleteGuard } from '../auth/guards/profile-complete.guard';



@Module({
  imports: [SupabaseModule],
  controllers: [BookingController],
  providers: [BookingService,ProfileCompleteGuard],
  exports: [BookingService],
})
export class BookingModule {}
