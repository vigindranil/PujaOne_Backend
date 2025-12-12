import { Module } from '@nestjs/common';
import { PurohitService } from './purohit.service';
import { PurohitController } from './purohit.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SupabaseModule, UsersModule],
  controllers: [PurohitController],
  providers: [PurohitService],
  exports: [PurohitService],
})
export class PurohitModule {}
