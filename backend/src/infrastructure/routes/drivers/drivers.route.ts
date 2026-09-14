import type { ServerRoute } from '@hapi/hapi';
import { driversController } from './drivers.controller';
import driversDocs from './drivers.doc';

export const driversListRoute: ServerRoute = {
  method: 'GET',
  path: '/api/drivers',
  options: {
    description: 'List all drivers',
    notes: 'Returns every driver on the grid. Each driver references a team via teamId.',
    handler: driversController.list,
    plugins: { 'hapi-swagger': { responses: driversDocs.list.responses } },
    tags: ['api', 'drivers'],
  },
};
