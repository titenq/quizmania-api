import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import {
  createQuizController,
  getAllQuizController,
  getQuizController
} from '../controllers/quizController';
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
      getAllQuizController
    );
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/quizzes/questions/:quizId',
    //{ schema: quizGetSchema },
      { schema: { hide: true }},
      getQuizController
    );
};

export default quizRoute;
