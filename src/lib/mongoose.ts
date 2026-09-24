import mongoose from 'mongoose';
import { logger } from '../config/logger.js';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI no está definida en las variables de entorno');
  }

  try {
    await mongoose.connect(uri);
    logger.info('✅ Conectado a MongoDB');
  } catch (err) {
    logger.error('❌ Error al conectar con MongoDB', err);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB desconectado');
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB desconectado');
});
