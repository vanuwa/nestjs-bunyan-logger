import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  health() {
    return {
      ok: true,
      uptime: process.uptime(),
      responseTime: process.hrtime(),
      timestamp: Date.now()
    };
  }
}
