import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { parseIntIdPipe } from './common/pipes/parseIntId.pipe';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
    new parseIntIdPipe()
  );

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4200',
      'http://localhost:3001',
      'https://recados-nest.vercel.app',
      'https://seu-frontend.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet({
      contentSecurityPolicy: false,
    }));
  }

  const documentBuilder = new DocumentBuilder()
    .setTitle('Recados API')
    .setDescription('API para o projeto de recados')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('recados', 'Endpoints para gerenciamento de recados')
    .addTag('pessoas', 'Endpoints para gerenciamento de pessoas')
    .addTag('auth', 'Endpoints para autenticação')
    .addTag('receive', 'Endpoints para recebimento de dados')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Recados API Documentation',
  });

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
