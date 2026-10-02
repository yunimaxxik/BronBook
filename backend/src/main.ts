import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import session from 'express-session';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.use(
    session({
      secret: 'your-super-secret-diploma-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
      },
    }),
  );

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
