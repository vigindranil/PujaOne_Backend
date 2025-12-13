import { Module } from "@nestjs/common";
import { SamagriKitsController } from "./samagri-kits.controller";
import { SamagriKitsService } from "./samagri-kits.service";
import { SupabaseModule } from "../supabase/supabase.module";

@Module({
  imports: [SupabaseModule],
  controllers: [SamagriKitsController],
  providers: [SamagriKitsService],
  exports: [SamagriKitsService],
})
export class SamagriKitsModule {}
