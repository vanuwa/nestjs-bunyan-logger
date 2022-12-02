import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BunyanLoggerModule } from './logger/bunyan-logger.module';
import { IntegrationPlatformModule } from './integration-platform/integration-platform.module';
import { AuthModule } from './auth/auth.module';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [BunyanLoggerModule, IntegrationPlatformModule, AuthModule, MarketplaceModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
