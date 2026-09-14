import type { ITeam } from '@domain/_interfaces/teams.interface';
import type { TeamRepository } from '@domain/_repositories/team.repository';
import Boom from '@hapi/boom';
import { filesService } from '@services/files.service';
import logger from '@services/logger.service';
import teamsFileErrors from './teamsFile.errors';

const DATA_FILE = 'teams.json';

const teamsFileRepository: TeamRepository = {
  findAll: async (): Promise<ITeam[]> => {
    try {
      return await filesService.readJsonData<ITeam[]>(DATA_FILE);
    } catch (error) {
      logger.error(__filename, 'findAll', 'error', error);
      throw Boom.badImplementation(teamsFileErrors.internalError.message, {
        code: teamsFileErrors.internalError.code,
      });
    }
  },
};

export default teamsFileRepository;
