import Boom from '@hapi/boom';
import type {
  IRace,
  IRaceDetails,
  ISimulationParameters,
  IWeatherForecast,
} from '@domain/_interfaces/races.interface';
import type { CircuitRepository } from '@domain/_repositories/circuit.repository';
import type { RaceRepository } from '@domain/_repositories/race.repository';
import racesErrors from './races.errors';

interface RacesRepositories {
  raceRepository: RaceRepository;
  circuitRepository: CircuitRepository;
}

function racesDomainFactory(repositories: RacesRepositories) {
  const { raceRepository, circuitRepository } = repositories;

  /** Every race-scoped lookup starts here so an unknown id always yields the same 404. */
  async function requireRace(raceId: string): Promise<IRace> {
    const race = await raceRepository.findById(raceId);
    if (!race) {
      throw Boom.notFound(racesErrors.raceNotFound.message, {
        code: racesErrors.raceNotFound.code,
      });
    }
    return race;
  }

  return {
    async list(): Promise<IRace[]> {
      return raceRepository.findAll();
    },

    /** Returns the race with its circuit embedded, so one call describes the whole event. */
    async getById(raceId: string): Promise<IRaceDetails> {
      const race = await requireRace(raceId);

      const circuit = await circuitRepository.findById(race.circuitId);
      if (!circuit) {
        throw Boom.badImplementation(racesErrors.circuitNotFound.message, {
          code: racesErrors.circuitNotFound.code,
        });
      }

      return { ...race, circuit };
    },

    async getWeather(raceId: string): Promise<IWeatherForecast> {
      await requireRace(raceId);

      const weather = await raceRepository.findWeatherByRaceId(raceId);
      if (!weather) {
        throw Boom.badImplementation(racesErrors.weatherNotFound.message, {
          code: racesErrors.weatherNotFound.code,
        });
      }

      return weather;
    },

    async getSimulationParameters(raceId: string): Promise<ISimulationParameters> {
      await requireRace(raceId);

      const parameters = await raceRepository.findSimulationParametersByRaceId(raceId);
      if (!parameters) {
        throw Boom.badImplementation(racesErrors.simulationParametersNotFound.message, {
          code: racesErrors.simulationParametersNotFound.code,
        });
      }

      return parameters;
    },
  };
}

export default racesDomainFactory;
