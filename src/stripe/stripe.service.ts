import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: any;

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('stripe.secretKey');
    if (!stripeSecretKey) {
      console.warn('STRIPE_SECRET_KEY no está configurado en las variables de entorno');
    }
    this.stripe = new (Stripe as any)(stripeSecretKey || 'sk_test_placeholder');
  }

  async createCheckoutSession(items: any[], shipping: any, paymentMethod: string, total: number) {
    try {
      // Convertir el total a centavos (Stripe usa centavos)
      const amountInCents = Math.round(total * 100);

      // Crear line items para Stripe
      const lineItems = items.map(item => ({
        price_data: {
          currency: 'cop',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      // Crear sesión de checkout
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: 'http://localhost:4200/tienda?payment=success',
        cancel_url: 'http://localhost:4200/tienda?payment=cancelled',
        metadata: {
          shipping_name: shipping.fullName,
          shipping_address: shipping.address,
          shipping_city: shipping.city,
          shipping_phone: shipping.phone,
          payment_method: paymentMethod,
        },
      });

      return { url: session.url, sessionId: session.id };
    } catch (error) {
      console.error('Error al crear sesión de Stripe:', error);
      throw new Error('Error al crear sesión de pago');
    }
  }
}
