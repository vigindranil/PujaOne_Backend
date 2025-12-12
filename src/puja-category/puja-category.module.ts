import { Module } from '@nestjs/common';
import { PujaCategoryController } from './puja-category.controller';
import { PujaCategoryService } from './puja-category.service';

@Module({
  controllers: [PujaCategoryController],
  providers: [PujaCategoryService]
})
export class PujaCategoryModule {}
