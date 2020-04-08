import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as moment from 'moment';
import * as logger from 'morgan';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(compression());
  logger.token('log-time', () => moment().format('MM-DD HH:mm:ss'));
  app.use(logger('[:method] (:log-time) :url :status :remote-addr :response-time ms'));
  await app.listen(3000);
}
bootstrap();
