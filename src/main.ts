import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BunyanLoggerService } from './logger/bunyan-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'log', 'warn', 'debug', 'verbose'],
    bufferLogs: true
  });

  app.useLogger(app.get(BunyanLoggerService));

  await app.listen(3000);
}
bootstrap();
