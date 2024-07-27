import { FastifyInstance } from 'fastify';

import {
  facebookAuthController,
  facebookCallbackController,
  facebookUserController
} from '../controllers/facebookController';

const facebookRoute = async (fastify: FastifyInstance) => {
  fastify.get('/facebook',
    { schema: { hide: true } },
    facebookAuthController
  );

  fastify.get('/facebook/callback',
    { schema: { hide: true } },
    facebookCallbackController
  );

  fastify.post('/facebook/user',
    { schema: { hide: true } },
    facebookUserController
  );
};

export default facebookRoute;
