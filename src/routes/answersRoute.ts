import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createAnswerController } from '../controllers/answerController';
import { answerCreateSchema } from '../schemas/answerSchema';

const answersRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/answers/:quizId',
      { schema: answerCreateSchema },
      createAnswerController
    );
};

export default answersRoute;
