import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  
  app.use('/webhook/stripe', express.raw({ type: 'application/json' }))
  app.enableShutdownHooks();
  app.getHttpAdapter().getInstance().use('/health', (req, res) => res.status(200).send('OK'));
  await app.listen(process.env.PORT ?? 1000);
}
bootstrap();