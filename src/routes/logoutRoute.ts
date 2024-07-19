import { promisify } from 'node:util';

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ILogoutResponse } from '../interfaces/ILogoutResponse';

const { NAME_SESSION } = process.env;

const destroySession = async (request: FastifyRequest): Promise<void> => {
  const destroy = promisify(request.session.destroy.bind(request.session));

  await destroy();
};

const logoutRoute = async (fastify: FastifyInstance) => {
  fastify.get('/logout',
    {
      schema: { hide: true }
    },
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        await destroySession(request);

        reply.clearCookie(NAME_SESSION!);

        const messageSuccess: ILogoutResponse = { message: 'Sucesso ao fazer logout' };

        reply.status(200).send(messageSuccess);
      } catch (error) {
        const messageError: ILogoutResponse = { message: 'Erro ao fazer logout' };

        reply.status(400).send(messageError);
      }
    }
  );
};

export default logoutRoute;
