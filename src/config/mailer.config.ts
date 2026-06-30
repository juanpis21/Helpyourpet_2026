import { ConfigService } from '@nestjs/config';

export function buildMailerConfig(configService: ConfigService) {
  const host = configService.get<string>('smtp.host') || 'smtp.gmail.com';
  const port = Number(configService.get<string>('smtp.port') || '465');
  const secureValue = configService.get<string | boolean | number | undefined>('smtp.secure');
  const secure = secureValue === true || secureValue === 'true' || secureValue === '1' || secureValue === 1
    ? true
    : secureValue === false || secureValue === 'false' || secureValue === '0' || secureValue === 0
      ? false
      : port === 465;
  const user = configService.get<string>('smtp.user');
  const pass = configService.get<string>('smtp.pass');
  const from = configService.get<string>('smtp.from') || user || 'no-reply@helpyourpet.com';

  const transport: Record<string, unknown> = {
    host,
    port,
    secure,
  };

  if (user && pass) {
    transport.auth = { user, pass };
  }

  return {
    transport,
    defaults: {
      from: `"HelpyourPet" <${from}>`,
    },
  };
}
