import { FastifyInstance } from 'fastify';

import {
  githubAuthController,
  githubCallbackController,
  githubUserController
} from '../controllers/githubController';

const githubRoute = async (fastify: FastifyInstance) => {
  fastify.get('/github',
    { schema: { hide: true } },
    githubAuthController
  );

  fastify.get('/github/callback',
    { schema: { hide: true } },
    githubCallbackController
  );

  fastify.post('/github/user',
    { schema: { hide: true } },
    githubUserController
  );
};

export default githubRoute;
