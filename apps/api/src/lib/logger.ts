import pino from 'pino';
import { env, isProd } from './env';

/**
 * Pino logger. Redacts sensitive fields so phone numbers, tokens, OTPs and
 * payment secrets never land in logs (hardened further in B1-13).
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers["x-razorpay-signature"]',
      'req.body.password',
      'req.body.otp',
      'req.body.firebaseIdToken',
      'req.body.token',
      'req.body.refreshToken',
      // FCM device tokens are send-credentials: anyone holding one can push to
      // that device. notifications.service logs the token on a failed send.
      'token',
      '*.token',
      '*.deviceToken',
      '*.hashedToken',
      '*.otpHash',
      '*.phone',
      '*.email',
      '*.accessToken',
      '*.refreshToken',
      '*.razorpaySignature',
    ],
    censor: '[redacted]',
  },
  transport: isProd
    ? undefined
    : { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } },
});
