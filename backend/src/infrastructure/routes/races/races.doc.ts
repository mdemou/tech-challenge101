import { CIRCUIT_SCHEMA } from '@infrastructure/routes/circuits/circuits.doc';
import { createResponseDoc } from '@infrastructure/routes/doc/docFactory';
import { createValidationFailAction } from '@infrastructure/routes/validationFailAction';
import Joi from 'joi';
import racesResponses from './races.responses';

/** Shared param schema: a well-formed but unknown id yields 404, a malformed one yields 400. */
export const RACE_ID_PARAM = Joi.object({
  raceId: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .max(64)
    .required()
    .example('race-01'),
});

const RACE_SCHEMA = Joi.object({
  id: Joi.string().example('race-01'),
  name: Joi.string().example('Bahrain Grand Prix'),
  round: Joi.number().example(1),
  date: Joi.string().example('2025-04-13'),
  circuitId: Joi.string().example('circuit-01').description('References a circuit from GET /api/circuits'),
  laps: Joi.number().example(57),
  temperature: Joi.number().example(31).description('Expected ambient temperature in Celsius.'),
  rainProbability: Joi.number().example(0.02).description('0 = dry certainty, 1 = rain certainty.'),
}).label('Race');

const RACE_DETAILS_SCHEMA = RACE_SCHEMA.keys({
  circuit: CIRCUIT_SCHEMA,
}).label('RaceDetails');

const WEATHER_SEGMENT_SCHEMA = Joi.object({
  fromLap: Joi.number().example(1),
  toLap: Joi.number().example(19),
  temperature: Joi.number().example(32),
  rainIntensity: Joi.number().example(0).description('0 = dry, 1 = heaviest rain.'),
}).label('WeatherSegment');

const WEATHER_SCHEMA = Joi.object({
  raceId: Joi.string().example('race-01'),
  summary: Joi.string().example('Very hot and completely dry. High thermal tyre stress.'),
  forecast: Joi.array().items(WEATHER_SEGMENT_SCHEMA),
}).label('WeatherForecast');

const SIMULATION_PARAMETERS_SCHEMA = Joi.object({
  raceId: Joi.string().example('race-01'),
  lapTimeVariance: Joi.number().example(0.15).description('Typical lap-to-lap noise in seconds.'),
  pitStopLoss: Joi.number().example(22).description('Seconds lost for a pit stop, excluding the tyre change.'),
  tyreChangeTime: Joi.number().example(2.5).description('Stationary seconds to swap tyres.'),
  fuelEffectPerLap: Joi.number().example(0.037).description('Seconds per lap gained as fuel burns off.'),
  safetyCarProbability: Joi.number().example(0.2).description('0 = never, 1 = certain.'),
  minimumPitStops: Joi.number().example(1).description('Pit stops required by the sporting rules.'),
}).label('SimulationParameters');

const racesDocs = {
  list: {
    responses: createResponseDoc('listRaces', racesResponses.listOk, {
      dataSchema: Joi.object({ races: Joi.array().items(RACE_SCHEMA) }),
      500: racesResponses.internalError,
    }),
  },
  details: {
    responses: createResponseDoc('getRace', racesResponses.detailsOk, {
      dataSchema: RACE_DETAILS_SCHEMA,
      400: racesResponses.badRequest(400, 'Validation error'),
      404: racesResponses.notFound,
      500: racesResponses.internalError,
    }),
    parameters: {
      params: RACE_ID_PARAM,
      failAction: createValidationFailAction(racesResponses.badRequest),
    },
  },
  weather: {
    responses: createResponseDoc('getRaceWeather', racesResponses.weatherOk, {
      dataSchema: WEATHER_SCHEMA,
      400: racesResponses.badRequest(400, 'Validation error'),
      404: racesResponses.notFound,
      500: racesResponses.internalError,
    }),
    parameters: {
      params: RACE_ID_PARAM,
      failAction: createValidationFailAction(racesResponses.badRequest),
    },
  },
  simulationParameters: {
    responses: createResponseDoc('getRaceSimulationParameters', racesResponses.simulationParametersOk, {
      dataSchema: SIMULATION_PARAMETERS_SCHEMA,
      400: racesResponses.badRequest(400, 'Validation error'),
      404: racesResponses.notFound,
      500: racesResponses.internalError,
    }),
    parameters: {
      params: RACE_ID_PARAM,
      failAction: createValidationFailAction(racesResponses.badRequest),
    },
  },
};

export default racesDocs;
