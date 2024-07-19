import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import errorHandler from '../helpers/errorHandler';
import userService from '../services/userService';
import { userCreateSchema, userGetByEmailSchema } from '../schemas/userSchema';
import { IUser, IUserHeaders } from '../interfaces/userInterface';
import { IGenericError } from '../interfaces/errorInterface';

const userRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/users',
      {
        schema: userCreateSchema,
      },
      async (
        request: FastifyRequest<{ Body: IUser, Headers: IUserHeaders }>,
        reply: FastifyReply
      ) => {
        try {
          const { name, email, picture } = request.body;
          const { api_key } = request.headers;

          const { apiKey } = process.env;

          if (api_key !== apiKey) {
            const error: IGenericError = { error: 'api_key inválida' };

            reply.status(401).send(error);

            return;
          }

          const userExists = await userService.getUserByEmail(email);

          if (userExists) {
            const error: IGenericError = { error: 'E-mail já cadastrado' };

            return reply.status(409).send(error);
          }

          const user = await userService.createUser({
            name,
            email,
            picture
          });

          return reply.status(200).send(user);
        } catch (error) {
          errorHandler(error, request, reply);
        }
      }
    );

  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/users/:email',
      { schema: userGetByEmailSchema },
      async (
        request: FastifyRequest<{ Params: { email: string } }>,
        reply: FastifyReply
      ) => {
        try {
          const { email } = request.params;

          const user = await userService.getUserByEmail(email);

          if (!user) {
            return reply.status(404).send({
              error: 'Erro ao buscar usuário por e-mail'
            });
          }

          return reply.status(200).send(user);
        } catch (error) {
          errorHandler(error, request, reply);
        }
      }
    );
};

export default userRoute;
