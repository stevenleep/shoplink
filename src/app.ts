import 'reflect-metadata';
import dotenv from 'dotenv';
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
import logger from '@/utils/logger';
import errorHandler from '@/middleware/errorMiddleware';
import shutdownSignalsHandler from '@/middleware/shoutdownMiddleware';
import { setupStatic } from '@/middleware/staticMiddleware';

dotenv.config();
useContainer(Container);

const app: Application = express();
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

useExpressServer(app, {
  routePrefix: '/api',
  controllers: [path.join(__dirname, 'controllers/*.ts')],
  defaults: {
    paramOptions: {
      required: true,
    },
    nullResultCode: 404,
    undefinedResultCode: 204,
  },
});

const server: Server = app.listen(config.port, () => {
  logger.info(`pwa service listening on port ${config.port}`);
});

shutdownSignalsHandler(server);
