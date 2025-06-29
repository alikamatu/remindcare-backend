import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.getHttpAdapter().getInstance().use('/health', (req, res) => res.status(200).send('OK'));
  await app.listen(process.env.PORT ?? 1000);
}
bootstrap();
