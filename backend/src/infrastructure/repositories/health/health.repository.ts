import Boom from '@hapi/boom';
import healthErrors from '@domain/health/health.errors';
import { filesService } from '@services/files.service';
import logger from '@services/logger.service';

const healthRepository = {
  /**
   * The API serves hardcoded JSON, so "ready" means every data file on disk is
   * present and parses. A missing or malformed file fails the probe.
   */
  checkReadiness: async (): Promise<void> => {
    try {
      const files = await filesService.listJsonDataFiles();
      if (files.length === 0) {
        throw new Error('No JSON data files found');
      }
      for (const file of files) {
        await filesService.readJsonData<unknown>(file);
      }
    } catch (error) {
      logger.error(__filename, 'checkReadiness', 'error', error);
      throw Boom.serverUnavailable(healthErrors.serverUnavailable.message, {
        code: healthErrors.serverUnavailable.code,
      });
    }
  },
};

export default healthRepository;
