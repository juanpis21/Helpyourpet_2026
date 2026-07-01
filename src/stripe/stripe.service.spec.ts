import { StripeService } from './stripe.service';

describe('StripeService', () => {
  it('builds redirect urls with frontend base and payment params', () => {
    const configService = {
      get: jest.fn((key: string) => {
        if (key === 'stripe.secretKey') return 'sk_test_123';
        if (key === 'FRONTEND_URL') return 'http://localhost:4200';
        return undefined;
      }),
    } as any;

    const service = new StripeService(configService);

    expect(
      service.buildRedirectUrl('/perfil-usuario', {
        payment: 'success',
        session_id: '{CHECKOUT_SESSION_ID}',
      })
    ).toBe('http://localhost:4200/perfil-usuario?payment=success&session_id=%7BCHECKOUT_SESSION_ID%7D');
  });
});
