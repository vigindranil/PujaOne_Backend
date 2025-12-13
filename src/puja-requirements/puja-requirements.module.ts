import { Module } from '@nestjs/common';
import { PujaRequirementsService } from './puja-requirements.service';
import { PujaRequirementsController } from './puja-requirements.controller';

@Module({
  controllers: [PujaRequirementsController],
  providers: [PujaRequirementsService],
})
export class PujaRequirementsModule {}
