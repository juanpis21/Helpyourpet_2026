import { ConfigService } from '@nestjs/config';
import * as https from 'https';

export function buildMailerConfig(configService: ConfigService) {
  const host = configService.get<string>('smtp.host') || 'smtp.gmail.com';
  const port = Number(configService.get<string>('smtp.port') || '465');
  const secureValue = configService.get<string | boolean | number | undefined>('smtp.secure');
  const secure = secureValue === true || secureValue === 'true' || secureValue === '1' || secureValue === 1
    ? true
    : secureValue === false || secureValue === 'false' || secureValue === '0' || secureValue === 0
      ? false
      : port === 465;
  const user = configService.get<string>('smtp.user') || configService.get<string>('smtp.from');
  const pass = configService.get<string>('smtp.pass');
  const from = configService.get<string>('smtp.from') || user || 'no-reply@helpyourpet.com';

  // Check if we should use Brevo HTTP API to bypass Render's outbound SMTP port blocking
  const useBrevoApi = pass && pass.trim().startsWith('xkeysib-');

  let transport: any;

  if (useBrevoApi) {
    transport = {
      name: 'brevo-api-transport',
      version: '1.0.0',
      send: (mail: any, callback: any) => {
        try {
          const envelope = mail.data;
          
          let senderName = 'HelpyourPet';
          let senderEmail = from;
          if (envelope.from) {
            const fromStr = typeof envelope.from === 'string' ? envelope.from : String(envelope.from);
            const fromMatch = fromStr.match(/^(?:"?([^"]*)"?\s)?<?([^>]+)>?$/);
            if (fromMatch) {
              senderName = fromMatch[1] || 'HelpyourPet';
              senderEmail = fromMatch[2];
            }
          }

          const recipients: any[] = [];
          const toVal = envelope.to;
          if (typeof toVal === 'string') {
            recipients.push({ email: toVal });
          } else if (Array.isArray(toVal)) {
            toVal.forEach(item => {
              if (typeof item === 'string') {
                recipients.push({ email: item });
              } else if (item && typeof item === 'object') {
                recipients.push({ email: item.address || item.email, name: item.name });
              }
            });
          }

          const requestBody = JSON.stringify({
            sender: { name: senderName, email: senderEmail },
            to: recipients,
            subject: envelope.subject || 'No Subject',
            htmlContent: envelope.html,
            textContent: envelope.text
          });

          const options = {
            hostname: 'api.brevo.com',
            path: '/v3/smtp/email',
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'api-key': pass.trim(),
              'content-type': 'application/json',
              'content-length': Buffer.byteLength(requestBody)
            }
          };

          const req = https.request(options, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
              if (res.statusCode >= 200 && res.statusCode < 300) {
                const responseData = JSON.parse(body);
                callback(null, {
                  messageId: responseData.messageId || 'unknown',
                  response: body
                });
              } else {
                callback(new Error(`Brevo API returned status ${res.statusCode}: ${body}`));
              }
            });
          });

          req.on('error', err => {
            callback(err);
          });

          req.write(requestBody);
          req.end();
        } catch (err) {
          callback(err);
        }
      }
    };
  } else {
    transport = {
      host,
      port,
      secure,
      tls: {
        // Avoid issues with self-signed certificates or hostname altname mismatches (e.g. smtp-relay.brevo.com vs sendinblue.com)
        rejectUnauthorized: false,
      },
    };

    if (user && pass) {
      transport.auth = { user, pass };
    }
  }

  return {
    transport,
    defaults: {
      from: `"HelpyourPet" <${from}>`,
    },
  };
}

