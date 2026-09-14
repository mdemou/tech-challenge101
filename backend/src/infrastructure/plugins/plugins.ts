import type { Plugin } from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import * as HapiSwagger from 'hapi-swagger';
import pkg from '../../../package.json';

const swaggerOptions = {
  info: {
    title: 'f1simulatorapi API',
    version: pkg.version,
  },
  documentationPath: '/docs',
  jsonPath: '/docs.json',
  grouping: 'tags',
};

export const plugins: Plugin<unknown>[] = [
  Inert as unknown as Plugin<unknown>,
  Vision as unknown as Plugin<unknown>,
  { plugin: HapiSwagger, options: swaggerOptions } as unknown as Plugin<unknown>,
];
