import { NestFactory } from '@nestjs/core';
import { Font } from '@react-pdf/renderer';
import * as compression from 'compression';
import * as moment from 'moment';
import * as logger from 'morgan';
import { join } from 'path';

import { AppModule } from './app/app.module';

// 初始化 react-pdf 配置
// 字体加载
Font.register({ family: '苹方简细体', src: join(process.cwd(), 'fonts', './PingFang11.ttf') })
// 中文换行
Font.registerHyphenationCallback((word) =>
  Array.from(word).flatMap((char) => [char, ''])
)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(compression());
  logger.token('log-time', () => moment().format('MM-DD HH:mm:ss'));
  app.use(logger('[:method] (:log-time) :url :status :remote-addr :response-time ms'));
  await app.listen(3000);
}
bootstrap();
