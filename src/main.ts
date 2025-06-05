import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { parseIntIdPipe } from './common/pipes/parseIntId.pipe';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, //retorna um erro se houver propriedades que não estão no DTO
    transform: true, //transforma o tipo da propriedade para o tipo do DTO
  }),
    new parseIntIdPipe()

  );

  if (process.env.NODE_ENV === 'production') {
  app.use(helmet({

  }));

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    });
  }

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
