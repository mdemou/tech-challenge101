import type { ICircuit } from './circuits.interface';

export interface IRace {
  id: string;
  name: string;
  round: number;
  date: string;
  circuitId: string;
  laps: number;
  /** Expected ambient temperature in Celsius. */
  temperature: number;
  /** 0 = dry certainty, 1 = rain certainty. */
  rainProbability: number;
}

/** A race with its circuit resolved, so one call is enough to describe the event. */
export interface IRaceDetails extends IRace {
  circuit: ICircuit;
}

export interface IWeatherSegment {
  fromLap: number;
  toLap: number;
  temperature: number;
  /** 0 = dry, 1 = heaviest rain. */
  rainIntensity: number;
}

export interface IWeatherForecast {
  raceId: string;
  summary: string;
  forecast: IWeatherSegment[];
}

export interface ISimulationParameters {
  raceId: string;
  /** Typical lap-to-lap noise in seconds. */
  lapTimeVariance: number;
  /** Time lost in seconds for a pit stop, excluding the tyre change itself. */
  pitStopLoss: number;
  /** Stationary time in seconds to swap tyres. */
  tyreChangeTime: number;
  /** Seconds per lap gained as fuel burns off. */
  fuelEffectPerLap: number;
  /** 0 = never, 1 = certain. */
  safetyCarProbability: number;
  /** Pit stops required by the sporting rules for this race. */
  minimumPitStops: number;
}
