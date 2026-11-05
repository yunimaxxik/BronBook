import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport'; 
import { SanitizePipe } from './common/guards/sanitize.pipe.js'; 
import { SessionIoAdapter } from './common/adapters/session-io.adapter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    new SanitizePipe()
  );

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  const sessionMiddleware = session({
    secret: 'your-super-secret-diploma-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    },
  });

  app.use(sessionMiddleware);
  
  app.use(passport.initialize());
  app.use(passport.session());

  app.getHttpAdapter().getInstance().set('SESSION_MIDDLEWARE', sessionMiddleware); 
  app.useWebSocketAdapter(new SessionIoAdapter(app)); 

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();