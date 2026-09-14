import { createServer } from '@services/server.service';
import { registerDebugError } from '@infrastructure/extensions/debugError';
import { plugins } from '@plugins/plugins';
import { routes } from '@routes/routes';
import { registerLifecycle } from './lifecycle';
import { filesService } from '@services/files.service';
import logger from '@services/logger.service';

export async function initServer() {
  const server = createServer();

  await server.register(plugins);
  registerDebugError(server);
  server.route(routes);
  registerLifecycle(server);

  const dataFiles = await filesService.listJsonDataFiles();
  logger.info(__filename, 'data', `[DATA] Loaded ${dataFiles.length} JSON data file(s)`);

  return server;
}
