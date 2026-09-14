import type { ServerRoute } from '@hapi/hapi';
import { circuitsListRoute } from './circuits/circuits.route';
import { defaultRoute } from './default.route';
import { driversListRoute } from './drivers/drivers.route';
import { healthLivenessRoute, healthReadinessRoute } from './health/health.route';
import {
  racesDetailsRoute,
  racesListRoute,
  racesSimulationParametersRoute,
  racesWeatherRoute,
} from './races/races.route';
import { teamsListRoute } from './teams/teams.route';
import { tyresListRoute } from './tyres/tyres.route';
import {
  testHooksResetRateLimitsRoute,
  testHooksSetRateLimitRoute,
} from './testHooks/testHooks.route';

export const routes: ServerRoute[] = [
  driversListRoute,
  teamsListRoute,
  circuitsListRoute,
  tyresListRoute,
  racesListRoute,
  racesDetailsRoute,
  racesWeatherRoute,
  racesSimulationParametersRoute,
  defaultRoute,
  healthLivenessRoute,
  healthReadinessRoute,
  ...(process.env.E2E_TEST_HOOKS === 'true'
    ? [testHooksSetRateLimitRoute, testHooksResetRateLimitsRoute]
    : []),
];
