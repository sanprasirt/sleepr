import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  // const app = await NestFactory.createMicroservice(PaymentsModule, {
  //   transport: Transport.TCP,
  //   options: {

  // });
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('PORT'),
    },
  })
  // ใช้ Logger ที่เราสร้างไว้ใน LoggerModule
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  // await app.listen();
}
bootstrap();
