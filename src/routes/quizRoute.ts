import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import {
  createQuizController,
  getAllQuizController,
  getQuizController
} from '../controllers/quizController';
import {
  quizCreateSchema,
  quizGetAllSchema,
  quizGetSchema
} from '../schemas/quizSchema';

const quizRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/quizzes',
      { schema: quizCreateSchema },
      createQuizController
    );
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/quizzes/:userId',
      { schema: quizGetAllSchema },
      getAllQuizController
    );
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/quizzes/quiz/:quizId',
      { schema: quizGetSchema },
      getQuizController
    );
};

export default quizRoute;
