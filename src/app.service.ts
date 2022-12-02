import { Injectable } from '@nestjs/common';
import { IntegrationPlatformService } from './integration-platform/integration-platform.service';
import { BunyanLoggerService } from './logger/bunyan-logger.service';
import { MarketplaceService } from './marketplace/marketplace.service';

@Injectable()
export class AppService {
  private readonly logger = BunyanLoggerService.createLogger(AppService.name);

  constructor(private readonly integrationPlatform: IntegrationPlatformService, private readonly mkt: MarketplaceService) {}

  getHello(): string {
    return 'Hello World!';
  }

  health() {
    this.logger.info({ ok: true, date: new Date(), so: { many: { params: true } } }, 'hi there');
    this.logger.error([new Error('Oops'), { details: { id: 1238043 } }]);
    this.logger.error({ err: new Error('Oops. I did it again.'), details: { id: 1238043 } });
    this.logger.error(new Error('Oops. I did it again.'), 'Ooops. Error', 'My awesome message');
    this.logger.error(new Error('Oops. I did it again.'), { addtitional: { info: 'for debug' } }, 'Ooops. Error', 'My awesome message');
    this.logger.debug({ ok: true, uptime: 'yes', here: 'there' }, 'Debug');
    this.logger.warn({ warn: true, id: 1237657621 }, 'Pay attention to');

    this.integrationPlatform.execute().then(() => {
      this.logger.debug('executed');
    });

    return {
      ok: true,
      uptime: process.uptime(),
      responseTime: process.hrtime(),
      timestamp: Date.now()
    };
  }

  async test() {
    const uname = 'user';
    const pass = 'secret';

    const result = await this.mkt.loginAsUser(uname, pass);

    this.logger.info('TEST');

    return result;
  }
}
