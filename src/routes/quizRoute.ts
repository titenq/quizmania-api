import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import {
  answerQuizController,
  createQuizController,
  getAllQuizController,
  getLatestQuizController,
  getQuizController
} from '../controllers/quizController';
import {
  quizAnswerSchema,
  quizCreateSchema,
  quizGetAllSchema,
  quizGetLatestSchema,
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
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/quizzes/quiz/:quizId/answer',
      { schema: quizAnswerSchema },
      answerQuizController
    );
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/quizzes/latest',
      { schema: quizGetLatestSchema },
      getLatestQuizController
    );
};

export default quizRoute;
