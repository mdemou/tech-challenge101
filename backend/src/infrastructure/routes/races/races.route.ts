import type { ServerRoute } from '@hapi/hapi';
import { racesController } from './races.controller';
import racesDocs from './races.doc';

export const racesListRoute: ServerRoute = {
  method: 'GET',
  path: '/api/races',
  options: {
    description: 'List all races',
    notes: 'Each race references a circuit via circuitId and has its own weather and simulation parameters.',
    handler: racesController.list,
    plugins: { 'hapi-swagger': { responses: racesDocs.list.responses } },
    tags: ['api', 'races'],
  },
};

export const racesDetailsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/races/{raceId}',
  options: {
    description: 'Get a single race, with its circuit embedded',
    notes: 'Returns the race plus the full circuit object, so a single call describes the event.',
    handler: racesController.details,
    plugins: { 'hapi-swagger': { responses: racesDocs.details.responses } },
    validate: racesDocs.details.parameters,
    tags: ['api', 'races'],
  },
};

export const racesWeatherRoute: ServerRoute = {
  method: 'GET',
  path: '/api/races/{raceId}/weather',
  options: {
    description: 'Get the weather forecast for a race',
    notes:
      'The forecast is a list of lap ranges covering the full race distance. Conditions can change during the race.',
    handler: racesController.weather,
    plugins: { 'hapi-swagger': { responses: racesDocs.weather.responses } },
    validate: racesDocs.weather.parameters,
    tags: ['api', 'races'],
  },
};

export const racesSimulationParametersRoute: ServerRoute = {
  method: 'GET',
  path: '/api/races/{raceId}/simulation-parameters',
  options: {
    description: 'Get the simulation parameters for a race',
    notes:
      'Constants you can use to build your own simulation model. How you combine them is up to you.',
    handler: racesController.simulationParameters,
    plugins: { 'hapi-swagger': { responses: racesDocs.simulationParameters.responses } },
    validate: racesDocs.simulationParameters.parameters,
    tags: ['api', 'races'],
  },
};
