import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createAnswerController, /* getAnswerController */ } from '../controllers/answerController';

const answersRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/answers',
    // { schema: answerCreateSchema },
      { schema: { hide: true }},
      createAnswerController
    );
  
  /* fastify.withTypeProvider<ZodTypeProvider>()
    .get('/answers/:quizId',
      // { schema: answerGetSchema },
      { schema: { hide: true } },
      getAnswerController
    ); */
};

export default answersRoute;
