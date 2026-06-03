import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  @HttpCode(HttpStatus.OK)
  async createCheckoutSession(@Body() createCheckoutSessionDto: CreateCheckoutSessionDto) {
    try {
      const { url, sessionId } = await this.stripeService.createCheckoutSession(
        createCheckoutSessionDto.items,
        createCheckoutSessionDto.shipping,
        createCheckoutSessionDto.paymentMethod,
        createCheckoutSessionDto.total,
      );
      
      return { url, sessionId };
    } catch (error) {
      throw error;
    }
  }
}
