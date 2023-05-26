import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

  const config = new DocumentBuilder()
    .setTitle('赫拉管理系统')
    .setDescription('赫拉管理系统API')
    .setVersion('3.0.0')
    .addTag('hera')
    .build()
  app.setGlobalPrefix('api');
  // 需要配置在 global prefix 下面才能感知这个选项
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.use(compression());
  logger.token('log-time', () => moment().format('MM-DD HH:mm:ss'));
  app.use(logger('[:method] (:log-time) :url :status :remote-addr :response-time ms'));
  if (process.env.IS_DEV === 'true') {
    await app.listen(3000, '0.0.0.0');
  } else {
    await app.listen(process.env.PORT || 3000);
  }
}
bootstrap();
