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

          const { API_KEY } = process.env;

          if (api_key !== API_KEY) {
            const errorMessage: IGenericError = {
              message: 'api_key inválida',
              statusCode: 401
            };

            return errorHandler(errorMessage, request, reply);
          }

          const userExists = await userService.getUserByEmail(email);

          if (userExists) {
            const errorMessage: IGenericError = {
              message: 'E-mail já cadastrado',
              statusCode: 409
            };

            return errorHandler(errorMessage, request, reply);
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
            const errorMessage: IGenericError = {
              message: 'Erro ao buscar usuário por e-mail',
              statusCode: 404
            };

            return errorHandler(errorMessage, request, reply);
          }

          return reply.status(200).send(user);
        } catch (error) {
          const errorMessage: IGenericError = {
            message: 'Erro ao buscar usuário por e-mail',
            statusCode: 500
          };

          errorHandler(errorMessage, request, reply);
        }
      }
    );
};

export default userRoute;
