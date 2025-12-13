import { Module } from "@nestjs/common";
import { PurohitAvailabilityController } from "./purohit-availability.controller";
import { PurohitAvailabilityService } from "./purohit-availability.service";
import { SupabaseModule } from "../supabase/supabase.module";

@Module({
  imports: [SupabaseModule],
  controllers: [PurohitAvailabilityController],
  providers: [PurohitAvailabilityService],
  exports: [PurohitAvailabilityService],
})
export class PurohitAvailabilityModule {}
