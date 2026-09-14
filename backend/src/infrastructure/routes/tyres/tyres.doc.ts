import { createResponseDoc } from '@infrastructure/routes/doc/docFactory';
import Joi from 'joi';
import tyresResponses from './tyres.responses';

export const TYRE_SCHEMA = Joi.object({
  compound: Joi.string()
    .valid('SOFT', 'MEDIUM', 'HARD', 'INTERMEDIATE', 'WET')
    .example('SOFT'),
  pace: Joi.number().example(-1).description('Lap time delta in seconds vs the circuit base lap time. Negative is faster.'),
  degradation: Joi.number().example(0.09).description('Seconds added per lap of stint age.'),
  wetPerformance: Joi.number().example(0.1).description('Grip effectiveness on a wet track. 0 = unusable, 1 = fully effective.'),
  optimalRainIntensity: Joi.object({
    min: Joi.number().example(0),
    max: Joi.number().example(0.05),
  }).description('Rain intensity band this compound is designed for.'),
}).label('Tyre');

const tyresDocs = {
  list: {
    responses: createResponseDoc('listTyres', tyresResponses.listOk, {
      dataSchema: Joi.object({ tyres: Joi.array().items(TYRE_SCHEMA) }),
      500: tyresResponses.internalError,
    }),
  },
};

export default tyresDocs;
