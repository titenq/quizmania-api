import { FastifyInstance } from 'fastify';

import {
  xAuthController,
  xCallbackController,
  xUserController,
} from '../controllers/xController';

const xRoute = async (fastify: FastifyInstance) => {
  fastify.get('/x',
    { schema: { hide: true } },
    xAuthController
  );

  fastify.get('/x/callback',
    { schema: { hide: true } },
    xCallbackController
  );

  fastify.post('/x/user',
    { schema: { hide: true } },
    xUserController
  );
};

export default xRoute;
