import { promisify } from 'node:util';

import { FastifyRequest, FastifyReply } from 'fastify';

import { ILogoutResponse } from '../interfaces/logoutInterface';
import { IGenericError } from '../interfaces/errorInterface';
import errorHandler from '../helpers/errorHandler';

const { NAME_SESSION } = process.env;

const destroySession = async (request: FastifyRequest): Promise<void> => {
  const destroy = promisify(request.session.destroy.bind(request.session));

  await destroy();
};

export const logoutController = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    await destroySession(request);

    reply.clearCookie(NAME_SESSION!);

    const messageSuccess: ILogoutResponse = { message: 'Sucesso ao fazer logout' };

    reply.status(200).send(messageSuccess);
  } catch (error) {
    const errorMessage: IGenericError = {
      message: 'Erro ao fazer logout',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};
