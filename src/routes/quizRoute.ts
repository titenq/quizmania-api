import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import errorHandler from '../helpers/errorHandler';
import quizService from '../services/quizService';
import { quizCreateSchema } from '../schemas/quizSchema';
import { IGenericError } from '../interfaces/errorInterface';
import { IQuiz, IQuizHeaders } from '../interfaces/quizInterface';

const userRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/quizzes',
      {
        schema: quizCreateSchema,
      },
      async (
        request: FastifyRequest<{ Body: IQuiz, Headers: IQuizHeaders }>,
        reply: FastifyReply
      ) => {
        try {
          const { userId, quizTitle, questions } = request.body;
          const { api_key } = request.headers;

          const { apiKey } = process.env;

          if (api_key !== apiKey) {
            const error: IGenericError = { error: 'api_key inválida' };

            reply.status(401).send(error);

            return;
          }

          const quiz = await quizService.createQuiz({
            userId: userId.toString(),
            quizTitle,
            questions
          });

          return reply.status(200).send(quiz);
        } catch (error) {
          errorHandler(error, request, reply);
        }
      }
    );

  /* fastify.withTypeProvider<ZodTypeProvider>()
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
    ); */
};

export default userRoute;
