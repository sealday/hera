import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(compression());
  await app.listen(3000);
}
bootstrap();
