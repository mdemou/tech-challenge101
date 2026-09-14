import type {
  IRace,
  ISimulationParameters,
  IWeatherForecast,
} from '@domain/_interfaces/races.interface';

export interface RaceRepository {
  findAll: () => Promise<IRace[]>;
  findById: (id: string) => Promise<IRace | null>;
  findWeatherByRaceId: (raceId: string) => Promise<IWeatherForecast | null>;
  findSimulationParametersByRaceId: (raceId: string) => Promise<ISimulationParameters | null>;
}
