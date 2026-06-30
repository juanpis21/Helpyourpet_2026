import { buildMailerConfig } from './mailer.config';

describe('buildMailerConfig', () => {
  it('should build transport from SMTP environment values', () => {
    const configService = {
      get: jest.fn((key: string) => {
        const values: Record<string, string> = {
          'smtp.host': 'smtp-relay.brevo.com',
          'smtp.port': '587',
          'smtp.secure': 'false',
          'smtp.user': 'demo@helpyourpet.com',
          'smtp.pass': 'super-secret',
          'smtp.from': 'no-reply@helpyourpet.com',
        };
        return values[key];
      }),
    } as any;

    const config = buildMailerConfig(configService);

    expect(config.transport.host).toBe('smtp-relay.brevo.com');
    expect(config.transport.port).toBe(587);
    expect(config.transport.secure).toBe(false);
    expect(config.transport.auth).toEqual({
      user: 'demo@helpyourpet.com',
      pass: 'super-secret',
    });
    expect(config.defaults.from).toContain('no-reply@helpyourpet.com');
  });

  it('should default to a Gmail-compatible config when env is not set', () => {
    const configService = {
      get: jest.fn(() => undefined),
    } as any;

    const config = buildMailerConfig(configService);

    expect(config.transport.host).toBe('smtp.gmail.com');
    expect(config.transport.port).toBe(465);
    expect(config.transport.secure).toBe(true);
    expect(config.transport.auth).toBeUndefined();
    expect(config.defaults.from).toContain('HelpyourPet');
  });
});
