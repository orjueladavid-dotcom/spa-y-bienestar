// src/config/logger.ts — Winston + Morgan
//  - Nivel: 'http' en desarrollo, 'warn' en producción
//  - Formato: colorizado en desarrollo, JSON en producción
//  - Archivo logs/error.log solo en producción

import winston from 'winston';
import morgan from 'morgan';

const isProduction = process.env['NODE_ENV'] === 'production';

const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`),
);

const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const transports: winston.transport[] = [new winston.transports.Console()];

if (isProduction) {
  transports.push(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
}

export const logger = winston.createLogger({
  level: isProduction ? 'warn' : 'http',
  format: isProduction ? productionFormat : developmentFormat,
  transports,
});

// Morgan escribe cada petición HTTP a través de Winston (nivel http)
export const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message: string) => {
      logger.http(message.trim());
    },
  },
});
