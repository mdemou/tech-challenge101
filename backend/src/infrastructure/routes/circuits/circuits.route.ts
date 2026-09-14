import type { ServerRoute } from '@hapi/hapi';
import { circuitsController } from './circuits.controller';
import circuitsDocs from './circuits.doc';

export const circuitsListRoute: ServerRoute = {
  method: 'GET',
  path: '/api/circuits',
  options: {
    description: 'List all circuits',
    notes:
      'Circuits differ in length, pit-stop loss, tyre wear and overtaking difficulty. These values drive most of the strategy trade-offs.',
    handler: circuitsController.list,
    plugins: { 'hapi-swagger': { responses: circuitsDocs.list.responses } },
    tags: ['api', 'circuits'],
  },
};
