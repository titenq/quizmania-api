import { FastifyInstance } from 'fastify';

import { logoutController } from '../controllers/logoutController';

const logoutRoute = async (fastify: FastifyInstance) => {
  fastify.get('/logout',
    { schema: { hide: true } },
    logoutController
  );
};

export default logoutRoute;
