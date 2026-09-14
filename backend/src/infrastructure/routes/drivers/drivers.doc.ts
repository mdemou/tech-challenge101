import { createResponseDoc } from '@infrastructure/routes/doc/docFactory';
import Joi from 'joi';
import driversResponses from './drivers.responses';

export const DRIVER_SCHEMA = Joi.object({
  id: Joi.string().example('driver-01'),
  name: Joi.string().example('Lando Norris'),
  number: Joi.number().example(4),
  teamId: Joi.string().example('team-01').description('References a team from GET /api/teams'),
  pace: Joi.number().example(0.98).description('Relative driver pace. Higher is faster.'),
  consistency: Joi.number().example(0.95).description('How reliably the driver reproduces their pace.'),
}).label('Driver');

const driversDocs = {
  list: {
    responses: createResponseDoc('listDrivers', driversResponses.listOk, {
      dataSchema: Joi.object({ drivers: Joi.array().items(DRIVER_SCHEMA) }),
      500: driversResponses.internalError,
    }),
  },
};

export default driversDocs;
