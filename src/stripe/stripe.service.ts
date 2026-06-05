import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Stripe = require('stripe');

@Injectable()
export class StripeService {
  private stripe: any;

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('stripe.secretKey');
    if (!stripeSecretKey || stripeSecretKey === 'sk_test_placeholder') {
      console.warn('⚠️ STRIPE_SECRET_KEY no está configurado correctamente en .env');
    }
    console.log('🔑 Stripe inicializado con clave:', stripeSecretKey ? `${stripeSecretKey.substring(0, 12)}...` : 'NO CONFIGURADA');
    this.stripe = new Stripe(stripeSecretKey);
  }

  async createCheckoutSession(items: any[], shipping: any, paymentMethod: string, total: number) {
    try {
      // Tasa de cambio aproximada COP -> USD (1 USD ≈ 4100 COP)
      // Stripe no soporta COP directamente, usamos USD
      const COP_TO_USD_RATE = 4100;

      // Crear line items para Stripe (precio en centavos de USD)
      const lineItems = items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          // Convertir COP a centavos de USD: (precioCOP / TasaCambio) * 100
          unit_amount: Math.max(50, Math.round((item.price / COP_TO_USD_RATE) * 100)),
        },
        quantity: item.quantity,
      }));

      console.log('📦 Stripe line_items:', JSON.stringify(lineItems, null, 2));

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

      console.log('✅ Sesión de Stripe creada:', session.id);
      return { url: session.url, sessionId: session.id };
    } catch (error: any) {
      console.error('❌ Error al crear sesión de Stripe:', error.message || error);
      if (error.type) {
        console.error('   Tipo de error Stripe:', error.type);
      }
      if (error.raw) {
        console.error('   Detalle raw:', error.raw.message);
      }
      throw new Error(`Error al crear sesión de pago: ${error.message || 'Error desconocido'}`);
    }
  }
}
