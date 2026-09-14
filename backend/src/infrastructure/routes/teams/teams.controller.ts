import teamsDomainFactory from '@domain/teams/teams.domain';
import type { Request, ResponseToolkit } from '@hapi/hapi';
import teamsFileRepository from '@infrastructure/repositories/teamsFile/teamsFile.repository';
import teamsResponses from '@routes/teams/teams.responses';
import logger from '@services/logger.service';
import { IResponseData } from '@services/responses/responses.interfaces';
import responsesService from '@services/responses/responses.service';

const teamsDomain = teamsDomainFactory({
  teamRepository: teamsFileRepository,
});

export const teamsController = {
  list: async (request: Request, h: ResponseToolkit) => {
    let response: IResponseData;
    try {
      const teams = await teamsDomain.list();
      response = responsesService.createResponseData(teamsResponses.listOk, { teams });
    } catch (error) {
      logger.error(__filename, 'list', 'error', error);
      response = responsesService.createGeneralError(error);
    }
    return h.response(response.body).code(response.statusCode);
  },
};
