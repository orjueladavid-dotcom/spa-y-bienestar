import winston from 'winston';
import morgan from 'morgan';
import type { StreamOptions } from 'morgan';

const isProduction = process.env['NODE_ENV'] === 'production';

export const logger = winston.createLogger({
  level: isProduction ? 'warn' : 'http',
  format: isProduction
    ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      )
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
  transports: [
    new winston.transports.Console(),
    ...(isProduction
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
        ]
      : []),
  ],
});

const stream: StreamOptions = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export const morganMiddleware = morgan(
  isProduction ? 'combined' : 'dev',
  { stream },
);
