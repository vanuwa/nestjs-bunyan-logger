import { Module } from '@nestjs/common';
import { IntegrationPlatformService } from './integration-platform.service';

@Module({
  providers: [IntegrationPlatformService],
  exports: [IntegrationPlatformService]
})
export class IntegrationPlatformModule {}
