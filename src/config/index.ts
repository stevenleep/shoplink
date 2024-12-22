const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',

  app: {
    web_url: process.env.LOCAL_WEB_URL,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    preflightContinue: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
    ],
  },

  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export default config;
