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

  // --------------------------------------------------
  // ✅ JSON parser for ALL normal APIs (VERY IMPORTANT)
  // --------------------------------------------------
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // --------------------------------------------------
  // 🔥 Razorpay Webhook (RAW BODY – ONLY THIS ROUTE)
  // --------------------------------------------------
  app.use(
    '/api/webhook/razorpay',
    express.raw({
      type: 'application/json', // ⚠️ NEVER use */*
    }),
  );

  // --------------------------------------------------
  // 🌍 Global API Prefix
  // --------------------------------------------------
  app.setGlobalPrefix('api');

  // --------------------------------------------------
  // 🌐 CORS
  // --------------------------------------------------
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

  // --------------------------------------------------
  // 🧹 Global Validation
  // --------------------------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // 🔥 MUST for DTOs
      forbidNonWhitelisted: false,
    }),
  );

  // --------------------------------------------------
  // 📂 Static Files
  // --------------------------------------------------
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  // --------------------------------------------------
  // 📘 Swagger Setup
  // --------------------------------------------------
  const swaggerConfig = new DocumentBuilder()
    .setTitle('PujaOne API')
    .setDescription('API Documentation for PujaOne Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'PujaOne API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      tryItOutEnabled: true,
    },
  });

  // --------------------------------------------------
  // 🚀 Start Server
  // --------------------------------------------------
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🔥 PujaOne API running: http://localhost:${port}`);
  console.log(`📘 Swagger Docs: http://localhost:${port}/api/docs`);
  console.log(
    `💳 Razorpay Webhook: http://localhost:${port}/api/webhook/razorpay`,
  );
}

bootstrap();
