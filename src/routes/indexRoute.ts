import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FastifyInstance } from 'fastify';

const filename = fileURLToPath(import.meta.url);
const __dirname__ = dirname(filename);

const indexRoute = async (fastify: FastifyInstance) => {
  const files = readdirSync(__dirname__)
    .filter(file => file !== 'indexRoute.js' && file.endsWith('.js'));

  for (const file of files) {
    const routeModule = await import(resolve(__dirname__, file));

    fastify.register(routeModule);
  }
};

export default indexRoute;
