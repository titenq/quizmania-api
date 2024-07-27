import { FastifyInstance } from 'fastify';

import {
  googleAuthController,
  googleCallbackController,
  googleUserController
} from '../controllers/googleController';

const googleRoute = async (fastify: FastifyInstance) => {
  fastify.get('/google',
    { schema: { hide: true } },
    googleAuthController
  );

  fastify.get('/google/callback',
    { schema: { hide: true } },
    googleCallbackController
  );

  fastify.post('/google/user',
    { schema: { hide: true } },
    googleUserController
  );
};

export default googleRoute;
