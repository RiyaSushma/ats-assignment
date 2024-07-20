import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  console.log('TELEGRAM_TOKEN:', process.env.TELEGRAM_TOKEN);
  const app = await NestFactory.create(AppModule);
  await app.listen(8001);
}
bootstrap();
