import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { createQuizController } from '../controllers/quizController';
import { quizCreateSchema } from '../schemas/quizSchema';

const quizRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/quizzes',
      { schema: quizCreateSchema },
      createQuizController
    );
};

export default quizRoute;
