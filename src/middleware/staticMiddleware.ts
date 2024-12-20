import express, { Application } from 'express';
import artTemplate from 'art-template';
import expressArtTemplate from 'express-art-template';
import { staticPath, staticOptions, viewEngine, viewPath } from "@/config/path";

export function setupStatic(app: Application
): void {
  app.use('/static', express.static(staticPath, staticOptions));
}

export function setupRenderEnigine(app: Application): void {
  app.engine('art', expressArtTemplate);
  artTemplate.defaults.extname = viewEngine.extname;
  app.set('views', viewPath);
  app.set('view engine', 'art');
}