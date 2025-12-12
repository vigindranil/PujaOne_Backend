import { Module } from '@nestjs/common';
import { DevToolsController } from './devtools.controller';

@Module({
  controllers: [DevToolsController],
})
export class DevToolsModule {}
