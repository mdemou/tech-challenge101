import type { ServerRoute } from '@hapi/hapi';
import { tyresController } from './tyres.controller';
import tyresDocs from './tyres.doc';

export const tyresListRoute: ServerRoute = {
  method: 'GET',
  path: '/api/tyres',
  options: {
    description: 'List the available tyre compounds',
    notes:
      'Softer compounds are faster but degrade quicker. INTERMEDIATE and WET trade dry pace for wet grip. Use optimalRainIntensity to decide when each compound makes sense.',
    handler: tyresController.list,
    plugins: { 'hapi-swagger': { responses: tyresDocs.list.responses } },
    tags: ['api', 'tyres'],
  },
};
