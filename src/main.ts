import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Serve static assets
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('PujaOne API')
    .setDescription('API Documentation for PujaOne Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // IMPORTANT: Use `api/docs`
 SwaggerModule.setup('api/docs', app, document, {
  customSiteTitle: 'PujaOne API Docs',
  customCssUrl: '/public/swagger.css',
  // customfavIcon: '/public/swagger-logo.png',
    // customJs: '/public/swagger.js',
  swaggerOptions: {
    persistAuthorization: true,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
    docExpansion: 'none',
    filter: true,
    tryItOutEnabled: true,
  },
});


  await app.listen(process.env.PORT || 3000);

  console.log(`🔥 PujaOne API running: http://localhost:${process.env.PORT || 3000}`);
  console.log(`📘 Swagger Docs: http://localhost:${process.env.PORT || 3000}/api/docs`);
}

bootstrap();
