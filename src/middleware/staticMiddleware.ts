import express, { Application } from 'express';
import { staticPath, staticOptions } from '@/config/path';

export function setupStatic(app: Application): void {
  app.use('/static', express.static(staticPath, staticOptions));
}
