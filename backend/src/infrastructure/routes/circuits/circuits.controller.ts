import circuitsDomainFactory from '@domain/circuits/circuits.domain';
import type { Request, ResponseToolkit } from '@hapi/hapi';
import circuitsFileRepository from '@infrastructure/repositories/circuitsFile/circuitsFile.repository';
import circuitsResponses from '@routes/circuits/circuits.responses';
import logger from '@services/logger.service';
import { IResponseData } from '@services/responses/responses.interfaces';
import responsesService from '@services/responses/responses.service';

const circuitsDomain = circuitsDomainFactory({
  circuitRepository: circuitsFileRepository,
});

export const circuitsController = {
  list: async (request: Request, h: ResponseToolkit) => {
    let response: IResponseData;
    try {
      const circuits = await circuitsDomain.list();
      response = responsesService.createResponseData(circuitsResponses.listOk, { circuits });
    } catch (error) {
      logger.error(__filename, 'list', 'error', error);
      response = responsesService.createGeneralError(error);
    }
    return h.response(response.body).code(response.statusCode);
  },
};
