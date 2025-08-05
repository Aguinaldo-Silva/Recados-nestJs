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
      'http://localhost:4200',
      'https://recados-nest.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: false, 
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`, 'https://cdnjs.cloudflare.com'],
          scriptSrc: [`'self'`, `'unsafe-inline'`, 'https://cdnjs.cloudflare.com'],
          imgSrc: [`'self'`, 'data:', 'https:'],
          fontSrc: [`'self'`, 'https://cdnjs.cloudflare.com'],
          connectSrc: [`'self'`],
          frameSrc: [`'self'`],
          objectSrc: [`'none'`],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
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
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'Recados API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.24.2/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.24.2/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.24.2/swagger-ui.min.css',
    ],
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
