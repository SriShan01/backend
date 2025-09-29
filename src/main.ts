// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'https://backend-production-4551.up.railway.app/' });
  await app.listen(4000);
}
bootstrap();