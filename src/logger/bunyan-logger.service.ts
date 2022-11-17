import { LoggerService } from '@nestjs/common';
import * as Bunyan from 'bunyan';

export class BunyanLoggerService implements LoggerService {
  private bunyanLogger: Bunyan;

  private static defaultOptions = {
    name: BunyanLoggerService.name,
    stream: process.stdout,
    level: 'trace',
    src: false
  };

  constructor() {
    this.bunyanLogger = BunyanLoggerService.createLogger();
  }

  static createLogger(options = {}) {
    let extension = options;

    if (typeof options === 'string') {
      extension = { name: options };
    }

    return Bunyan.createLogger({
      ...BunyanLoggerService.defaultOptions,
      ...extension,
    });
  }

  error(
    message: any | any[],
    trace?: string | undefined,
    context?: string | undefined,
  ): any {
    message = Array.isArray(message) ? message : [message];

    this.bunyanLogger.error({ context, trace }, ...message);
  }

  log(message: any | any[], context?: string | undefined): any {
    message = Array.isArray(message) ? message : [message];

    this.bunyanLogger.info({ context }, ...message);
  }

  warn(message: any | any[], context?: string | undefined): any {
    message = Array.isArray(message) ? message : [message];

    this.bunyanLogger.warn({ context }, ...message);
  }
}
