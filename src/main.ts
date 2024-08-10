import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsOptions = {
    origin: process.env.frontendBaseURL, // Use environment variable
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.setGlobalPrefix(configService.get<string>('BASE_URL'));
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
