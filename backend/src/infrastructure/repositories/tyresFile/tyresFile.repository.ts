import type { ITyre } from '@domain/_interfaces/tyres.interface';
import type { TyreRepository } from '@domain/_repositories/tyre.repository';
import Boom from '@hapi/boom';
import { filesService } from '@services/files.service';
import logger from '@services/logger.service';
import tyresFileErrors from './tyresFile.errors';

const DATA_FILE = 'tyres.json';

const tyresFileRepository: TyreRepository = {
  findAll: async (): Promise<ITyre[]> => {
    try {
      return await filesService.readJsonData<ITyre[]>(DATA_FILE);
    } catch (error) {
      logger.error(__filename, 'findAll', 'error', error);
      throw Boom.badImplementation(tyresFileErrors.internalError.message, {
        code: tyresFileErrors.internalError.code,
      });
    }
  },
};

export default tyresFileRepository;
