import type { ServerRoute } from '@hapi/hapi';
import { teamsController } from './teams.controller';
import teamsDocs from './teams.doc';

export const teamsListRoute: ServerRoute = {
  method: 'GET',
  path: '/api/teams',
  options: {
    description: 'List all teams',
    notes: 'Returns every team in the championship, with its relative car performance.',
    handler: teamsController.list,
    plugins: { 'hapi-swagger': { responses: teamsDocs.list.responses } },
    tags: ['api', 'teams'],
  },
};
