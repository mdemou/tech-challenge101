import { createResponseDoc } from '@infrastructure/routes/doc/docFactory';
import Joi from 'joi';
import circuitsResponses from './circuits.responses';

export const CIRCUIT_SCHEMA = Joi.object({
  id: Joi.string().example('circuit-01'),
  name: Joi.string().example('Bahrain International Circuit'),
  country: Joi.string().example('Bahrain'),
  type: Joi.string().example('permanent'),
  laps: Joi.number().example(57),
  lengthKm: Joi.number().example(5.412),
  baseLapTime: Joi.number().example(91.5).description('Reference dry lap time in seconds.'),
  pitStopLoss: Joi.number().example(22).description('Seconds lost for a pit stop, excluding the tyre change.'),
  tyreWear: Joi.number().example(1.35).description('Multiplier applied to tyre degradation. 1.0 is neutral.'),
  overtakingDifficulty: Joi.number().example(0.3).description('0 = easy to overtake, 1 = nearly impossible.'),
}).label('Circuit');

const circuitsDocs = {
  list: {
    responses: createResponseDoc('listCircuits', circuitsResponses.listOk, {
      dataSchema: Joi.object({ circuits: Joi.array().items(CIRCUIT_SCHEMA) }),
      500: circuitsResponses.internalError,
    }),
  },
};

export default circuitsDocs;
