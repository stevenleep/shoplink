import 'reflect-metadata';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express, { Application } from 'express';
import { useExpressServer, useContainer } from 'routing-controllers';
import { Server } from 'http';
import { Container } from 'typedi';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import config from '@/config';
import storageConfig from '@/config/storage';
import logger from '@/utils/logger';
import errorHandler from '@/middleware/errorMiddleware';
import shutdownSignalsHandler from '@/middleware/shoutdownMiddleware';
import { setupStatic, setupRenderEnigine } from '@/middleware/staticMiddleware';
import { HealthController } from '@/controllers/HealthController';

dotenv.config();
useContainer(Container);

const app: Application = express();

// Database
mongoose
  .connect(storageConfig.mongodb.uri)
  .then((mongoose) => {
    logger.info('Connected to MongoDB', mongoose.connection.name, mongoose.connection.readyState);
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });

setupRenderEnigine(app);
setupStatic(app);

// Middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, parameterLimit: 50000 }));
app.use(errorHandler);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Controllers
useExpressServer(app, {
  routePrefix: '/health',
  controllers: [HealthController],
});
useExpressServer(app, {
  routePrefix: '/api',
  controllers: [path.join(__dirname, 'controllers/*.ts')],
});

const server: Server = app.listen(config.port, () => {
  logger.info(`pwa service listening on port ${config.port}`);
});

shutdownSignalsHandler(server);
