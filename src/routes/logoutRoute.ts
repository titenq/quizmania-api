import { promisify } from 'node:util';

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ILogoutResponse } from '../interfaces/logoutInterface';
import { IGenericError } from '../interfaces/errorInterface';
import errorHandler from '../helpers/errorHandler';

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
        const messageError: IGenericError = {
          message: 'Erro ao fazer logout',
          statusCode: 400
        };

        return errorHandler(messageError, request, reply);
      }
    }
  );
};

export default logoutRoute;
