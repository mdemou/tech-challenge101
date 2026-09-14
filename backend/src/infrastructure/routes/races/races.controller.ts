import racesDomainFactory from '@domain/races/races.domain';
import type { Request, ResponseToolkit } from '@hapi/hapi';
import circuitsFileRepository from '@infrastructure/repositories/circuitsFile/circuitsFile.repository';
import racesFileRepository from '@infrastructure/repositories/racesFile/racesFile.repository';
import racesResponses from '@routes/races/races.responses';
import logger from '@services/logger.service';
import { IResponseData } from '@services/responses/responses.interfaces';
import responsesService from '@services/responses/responses.service';

const racesDomain = racesDomainFactory({
  raceRepository: racesFileRepository,
  circuitRepository: circuitsFileRepository,
});

export const racesController = {
  list: async (request: Request, h: ResponseToolkit) => {
    let response: IResponseData;
    try {
      const races = await racesDomain.list();
      response = responsesService.createResponseData(racesResponses.listOk, { races });
    } catch (error) {
      logger.error(__filename, 'list', 'error', error);
      response = responsesService.createGeneralError(error);
    }
    return h.response(response.body).code(response.statusCode);
  },

  details: async (request: Request, h: ResponseToolkit) => {
    let response: IResponseData;
    try {
      const { raceId } = request.params as { raceId: string };
      const race = await racesDomain.getById(raceId);
      response = responsesService.createResponseData(racesResponses.detailsOk, race);
    } catch (error) {
      logger.error(__filename, 'details', 'error', error);
      response = responsesService.createGeneralError(error);
    }
    return h.response(response.body).code(response.statusCode);
  },

  weather: async (request: Request, h: ResponseToolkit) => {
    let response: IResponseData;
    try {
      const { raceId } = request.params as { raceId: string };
      const weather = await racesDomain.getWeather(raceId);
      response = responsesService.createResponseData(racesResponses.weatherOk, weather);
    } catch (error) {
      logger.error(__filename, 'weather', 'error', error);
      response = responsesService.createGeneralError(error);
    }
    return h.response(response.body).code(response.statusCode);
  },

  simulationParameters: async (request: Request, h: ResponseToolkit) => {
    let response: IResponseData;
    try {
      const { raceId } = request.params as { raceId: string };
      const parameters = await racesDomain.getSimulationParameters(raceId);
      response = responsesService.createResponseData(
        racesResponses.simulationParametersOk,
        parameters,
      );
    } catch (error) {
      logger.error(__filename, 'simulationParameters', 'error', error);
      response = responsesService.createGeneralError(error);
    }
    return h.response(response.body).code(response.statusCode);
  },
};
