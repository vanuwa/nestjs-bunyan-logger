import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BunyanLoggerModule } from './logger/bunyan-logger.module';
import { IntegrationPlatformModule } from './integration-platform/integration-platform.module';

@Module({
  imports: [BunyanLoggerModule, IntegrationPlatformModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
