import type {
  IRace,
  ISimulationParameters,
  IWeatherForecast,
} from '@domain/_interfaces/races.interface';
import type { RaceRepository } from '@domain/_repositories/race.repository';
import Boom from '@hapi/boom';
import { filesService } from '@services/files.service';
import logger from '@services/logger.service';
import racesFileErrors from './racesFile.errors';

const RACES_FILE = 'races.json';
const WEATHER_FILE = 'weather.json';
const SIMULATION_PARAMETERS_FILE = 'simulation-parameters.json';

async function load<T>(fileName: string, method: string): Promise<T> {
  try {
    return await filesService.readJsonData<T>(fileName);
  } catch (error) {
    logger.error(__filename, method, 'error', error);
    throw Boom.badImplementation(racesFileErrors.internalError.message, {
      code: racesFileErrors.internalError.code,
    });
  }
}

const racesFileRepository: RaceRepository = {
  findAll: async (): Promise<IRace[]> => {
    return load<IRace[]>(RACES_FILE, 'findAll');
  },

  findById: async (id: string): Promise<IRace | null> => {
    const races = await load<IRace[]>(RACES_FILE, 'findById');
    return races.find((race) => race.id === id) ?? null;
  },

  findWeatherByRaceId: async (raceId: string): Promise<IWeatherForecast | null> => {
    const weather = await load<IWeatherForecast[]>(WEATHER_FILE, 'findWeatherByRaceId');
    return weather.find((entry) => entry.raceId === raceId) ?? null;
  },

  findSimulationParametersByRaceId: async (
    raceId: string,
  ): Promise<ISimulationParameters | null> => {
    const parameters = await load<ISimulationParameters[]>(
      SIMULATION_PARAMETERS_FILE,
      'findSimulationParametersByRaceId',
    );
    return parameters.find((entry) => entry.raceId === raceId) ?? null;
  },
};

export default racesFileRepository;
