import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Allow your frontend origin
    credentials: true, // If you use cookies or auth headers
  });
  await app.listen(process.env.PORT ?? 1000);
}
bootstrap();