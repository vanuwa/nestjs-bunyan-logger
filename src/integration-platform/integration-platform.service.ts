import { Injectable } from '@nestjs/common';
import { BunyanLoggerService } from '../logger/bunyan-logger.service';

@Injectable()
export class IntegrationPlatformService {
  private readonly logger = BunyanLoggerService.createLogger(
    IntegrationPlatformService.name,
  );

  async execute() {
    const options = {
      campaign_id: 2346763,
      line_item_id: 787432,
      nested: {
        user: 'Username',
        component: {
          where: 'Universe'
        }
      }
    };

    this.logger.debug({ options }, 'Executing with options');
  }
}
