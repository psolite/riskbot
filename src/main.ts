import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/jupToken', express.static(join(__dirname, '..', 'jupToken')))
  await app.listen(3001);
}
bootstrap();
