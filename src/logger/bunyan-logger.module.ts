import { Module } from '@nestjs/common';
import { BunyanLoggerService } from './bunyan-logger.service';

@Module({
  providers: [BunyanLoggerService]
})
export class BunyanLoggerModule {}
