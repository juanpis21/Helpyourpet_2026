export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  node_env: process.env.NODE_ENV || 'development',
  database: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_DATABASE || 'clinic_pet',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true' || process.env.DB_SYNCHRONIZE === 'true' || process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '5h',
  },
  smtp: {
    host: (process.env.SMTP_HOST || 'smtp.gmail.com').trim(),
    port: parseInt((process.env.SMTP_PORT || '465').trim(), 10),
    secure: (process.env.SMTP_SECURE || '').trim() === 'true' || (process.env.SMTP_SECURE || '').trim() === '1' || undefined,
    user: process.env.SMTP_USER ? process.env.SMTP_USER.trim() : undefined,
    pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : undefined,
    from: process.env.SMTP_FROM ? process.env.SMTP_FROM.trim() : undefined,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
  },
  cors: {
    origin: true,
    credentials: true,
  },
});
