import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { createQuizController, getAllQuizController } from '../controllers/quizController';
import { quizCreateSchema, quizGetAllSchema } from '../schemas/quizSchema';

const quizRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/quizzes',
      { schema: quizCreateSchema },
      createQuizController
    );
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/quizzes/:userId',
      { schema: quizGetAllSchema },
      //{ schema: { hide: true } },
      getAllQuizController
    );
};

export default quizRoute;
