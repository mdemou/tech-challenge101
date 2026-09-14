import type { IDriver } from '@domain/_interfaces/drivers.interface';
import type { DriverRepository } from '@domain/_repositories/driver.repository';
import Boom from '@hapi/boom';
import { filesService } from '@services/files.service';
import logger from '@services/logger.service';
import driversFileErrors from './driversFile.errors';

const DATA_FILE = 'drivers.json';

const driversFileRepository: DriverRepository = {
  findAll: async (): Promise<IDriver[]> => {
    try {
      return await filesService.readJsonData<IDriver[]>(DATA_FILE);
    } catch (error) {
      logger.error(__filename, 'findAll', 'error', error);
      throw Boom.badImplementation(driversFileErrors.internalError.message, {
        code: driversFileErrors.internalError.code,
      });
    }
  },
};

export default driversFileRepository;
