import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(new ValidationPipe())
  app.useLogger(app.get(Logger))
  app.use(cookieParser())
  const configService = app.get(ConfigService)
  const PORT = process.env.PORT || configService.get('PORT') || 3000
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
