import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, //retorna um erro se houver propriedades que não estão no DTO
    transform: true, //transforma o tipo da propriedade para o tipo do DTO
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
