import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const config = new DocumentBuilder()
    .setTitle('Inventory API')
    .setDescription('Inventory & Order Management System')
    .setVersion('1.0')
    .addBearerAuth() // add authorize button
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, doc);

  await app.listen(process.env.PORT || 3000);
  console.log(`Server started at http://localhost:${process.env.PORT || 3000}`);
  console.log(`Swagger: http://localhost:${process.env.PORT || 3000}/api/docs`);
}
bootstrap();
