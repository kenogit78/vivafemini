import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('VivaFemini API')
    .setDescription(
      'Menstrual health tracking API — cycle, symptoms, health reports, and dashboard',
    )
    .setVersion('1.0')
    .addTag('users')
    .addTag('cycle')
    .addTag('symptoms')
    .addTag('health-report')
    .addTag('articles')
    .addTag('cycle-tips')
    .addTag('dashboard')
    .addTag('seed')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
}

bootstrap();
