import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from './dto/create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'), 
    {
      apiVersion: '2023-10-16', 
    },
  );

  constructor(private readonly configService: ConfigService) {}
  
  async createCharge(createChargeDto: CreateChargeDto) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: createChargeDto.card,
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: createChargeDto.amount,
      currency: 'thb',
      confirm: true,
      payment_method_types: ['card'],
    });
    return paymentIntent;
  }
}
