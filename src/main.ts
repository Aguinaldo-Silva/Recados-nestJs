import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { parseIntIdPipe } from './common/pipes/parseIntId.pipe';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, //retorna um erro se houver propriedades que não estão no DTO
    transform: true, //transforma o tipo da propriedade para o tipo do DTO
  }),
    new parseIntIdPipe()

  );

  app.enableCors({
    origin: ['https://recados-nest.vercel.app', 'http://localhost:3000', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }));
  }

  const documentBuilder = new DocumentBuilder()
    .setTitle('Recados API')
    .setDescription('API para o projeto de recados')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Recados API Documentation',
    customfavIcon: 'https://recados-nest.vercel.app/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showCommonExtensions: true,
    },
  });

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
