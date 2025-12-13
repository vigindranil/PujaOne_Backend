import { Module } from '@nestjs/common';
import { PujaPricingService } from './puja-pricing.service';
import { PujaPricingController } from './puja-pricing.controller';

@Module({
  providers: [PujaPricingService],
  controllers: [PujaPricingController],
})
export class PujaPricingModule {}
