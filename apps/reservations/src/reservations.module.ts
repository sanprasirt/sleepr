import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { AUTH_SERVICE, DatabaseModule, LoggerModule, PAYMENT_SERVICE } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { ReservationDocument, ReservationSchema } from './models/reservation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [DatabaseModule, 
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, 
        schema: ReservationSchema
      }
    ]),
    LoggerModule,
    // กำหนด ConfigModule 
    ConfigModule.forRoot({
      isGlobal: true,
      // กำหนดค่าให้กับ MONGODB_URI, PORT, AUTH_SERVICE_HOST, AUTH_SERVICE_PORT, PAYMENT_SERVICE_HOST, PAYMENT_SERVICE_PORT
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        AUTH_SERVICE_HOST: Joi.string().required(),
        AUTH_SERVICE_PORT: Joi.number().required(),
        PAYMENT_SERVICE_HOST: Joi.string().required(),
        PAYMENT_SERVICE_PORT: Joi.number().required(),
      })
    }),
    // สร้าง ClientsModule และกำหนดค่าให้กับ AUTH_SERVICE, PAYMENT_SERVICE
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_SERVICE_HOST'),
            port: configService.get('AUTH_SERVICE_PORT')
          }
        }),
        inject: [ConfigService]
      },
      {
        name: PAYMENT_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENT_SERVICE_HOST'),
            port: configService.get('PAYMENT_SERVICE_PORT')
          }
        }),
        inject: [ConfigService]
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
