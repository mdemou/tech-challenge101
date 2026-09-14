import { createResponseDoc } from '@infrastructure/routes/doc/docFactory';
import Joi from 'joi';
import teamsResponses from './teams.responses';

export const TEAM_SCHEMA = Joi.object({
  id: Joi.string().example('team-01'),
  name: Joi.string().example('Velocity Racing'),
  carPerformance: Joi.number().example(0.98).description('Relative car performance. Higher is faster.'),
}).label('Team');

const teamsDocs = {
  list: {
    responses: createResponseDoc('listTeams', teamsResponses.listOk, {
      dataSchema: Joi.object({ teams: Joi.array().items(TEAM_SCHEMA) }),
      500: teamsResponses.internalError,
    }),
  },
};

export default teamsDocs;
