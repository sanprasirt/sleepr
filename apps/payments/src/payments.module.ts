import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    // นำ ConfigModule มาใช้ใน PaymentsModule
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
      })
    }),
    // นำ LoggerModule from common lib มาใช้ใน PaymentsModule
    LoggerModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
