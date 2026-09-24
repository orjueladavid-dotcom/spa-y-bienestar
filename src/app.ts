import express from 'express';
import cookieParser from 'cookie-parser';
import { morganMiddleware } from './config/logger.js';
import authRouter from './routes/auth.routes.js';
import categoryRouter from './routes/category.routes.js';
import treatmentRouter from './routes/treatment.routes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/treatments', treatmentRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
