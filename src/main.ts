import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  initialize,
  createErrorRequestHandler,
  BaseResponseInterceptor,
} from 'core';

import qs from 'qs';
import { seed } from './database/seeders/seed-func';
import http from 'http';

async function bootstrap() {
  await initialize();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  let expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('query parser', (str: string) => qs.parse(str));
  // expressApp.get('/api/errors', createErrorRequestHandler());
  expressApp.get('/api/seed', async (req, res) => {
    await seed();
    res.send('seeded');
  });
  expressApp.get('/api/ping', (req, res) => {
    res.send('pong');
  });
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new BaseResponseInterceptor(reflector));
  await app.listen(process.env.PORT!);
}

bootstrap().then(() => {
  console.log('STARTED');
});
