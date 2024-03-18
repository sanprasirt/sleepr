import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATION_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  // สร้าง property ชื่อ stripe และกำหนดค่าเป็น new Stripe โดยใช้ this.configService.get('STRIPE_SECRET_KEY') เป็นค่าที่ส่งไป
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'), 
    {
      apiVersion: '2023-10-16', 
    },
  );

  // สร้าง constructor ที่รับค่า configService: ConfigService
  constructor(private readonly configService: ConfigService, 
    @Inject(NOTIFICATION_SERVICE) private readonly notificationClient: ClientProxy)  {}
  
  // สร้าง method ชื่อ createCharge ที่รับค่าจาก createChargeDto และส่งค่าไปยัง stripe.paymentIntents.create
  // โดยใช้ await เพื่อรอให้ stripe.paymentIntents.create ทำงานเสร็จก่อนแล้วค่อย return ค่าออกไป
  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    // สร้าง paymentMethod โดยใช้ stripe.paymentMethods.create และส่งค่า createChargeDto.card ไปด้วย
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {token: 'tok_visa'},
    });
    // สร้าง paymentIntent โดยใช้ stripe.paymentIntents.create และส่งค่า paymentMethod.id, createChargeDto.amount, 'thb', true, ['card'] ไปด้วย
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100,
      currency: 'thb',
      confirm: true,
      payment_method_types: ['card'],
      // payment_method: 'pm_card_visa',
    });

    this.notificationClient.emit('notify_email', { email });
    return paymentIntent;
  }
}
// const paymentIntent = await stripe.paymentIntents.create({
//   amount: 2000,
//   currency: 'usd',
//   automatic_payment_methods: {
//     enabled: true,
//   },
// });