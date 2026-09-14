const config = {
  appName: 'f1simulatorapi',
  logLevel: process.env.LOG_LEVEL || 'info',
  server: {
    port: Number(process.env.PORT) || 3001,
    host: process.env.HOST || '0.0.0.0',
  },
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3001',
  rateLimit: {
    default: {
      maxAttempts: Number(process.env.RATE_LIMIT_DEFAULT_MAX) || 100,
      windowMs: Number(process.env.RATE_LIMIT_DEFAULT_WINDOW_MS) || 3_600_000,
    },
  },
};

export default config;
