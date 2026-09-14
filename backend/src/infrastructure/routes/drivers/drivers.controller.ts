import driversDomainFactory from '@domain/drivers/drivers.domain';
import type { Request, ResponseToolkit } from '@hapi/hapi';
import driversFileRepository from '@infrastructure/repositories/driversFile/driversFile.repository';
import driversResponses from '@routes/drivers/drivers.responses';
import logger from '@services/logger.service';
import { IResponseData } from '@services/responses/responses.interfaces';
import responsesService from '@services/responses/responses.service';

const driversDomain = driversDomainFactory({
  driverRepository: driversFileRepository,
});

export const driversController = {
  list: async (request: Request, h: ResponseToolkit) => {
    let response: IResponseData;
    try {
      const drivers = await driversDomain.list();
      response = responsesService.createResponseData(driversResponses.listOk, { drivers });
    } catch (error) {
      logger.error(__filename, 'list', 'error', error);
      response = responsesService.createGeneralError(error);
    }
    return h.response(response.body).code(response.statusCode);
  },
};
