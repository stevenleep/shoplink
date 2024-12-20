import path from 'path';

export const rootPath = process.cwd();
export const staticPath = path.join(rootPath, 'public');
export const viewPath = path.join(rootPath, 'views');

export const staticOptions = {
  maxAge: '30d',
};

export const viewEngine = {
  extname: '.art',
};
