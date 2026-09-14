import type { Server } from '@hapi/hapi';

export function registerLifecycle(server: Server) {
  server.ext('onPreStop', () => {
    console.log('Server is stopping...');
  });

  const shutdown = () => {
    console.log('Graceful shutdown initiated');
    void server.stop({ timeout: 10_000 }).then(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
