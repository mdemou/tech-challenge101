import tyresDomainFactory from '@domain/tyres/tyres.domain';
import type { Request, ResponseToolkit } from '@hapi/hapi';
import tyresFileRepository from '@infrastructure/repositories/tyresFile/tyresFile.repository';
import tyresResponses from '@routes/tyres/tyres.responses';
import logger from '@services/logger.service';
import { IResponseData } from '@services/responses/responses.interfaces';
import responsesService from '@services/responses/responses.service';

const tyresDomain = tyresDomainFactory({
  tyreRepository: tyresFileRepository,
});

export const tyresController = {
  list: async (request: Request, h: ResponseToolkit) => {
    let response: IResponseData;
    try {
      const tyres = await tyresDomain.list();
      response = responsesService.createResponseData(tyresResponses.listOk, { tyres });
    } catch (error) {
      logger.error(__filename, 'list', 'error', error);
      response = responsesService.createGeneralError(error);
    }
    return h.response(response.body).code(response.statusCode);
  },
};
