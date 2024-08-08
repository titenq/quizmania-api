import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createAnswerController,
  getAnswersController,
  getAnswersPercentageController
} from '../controllers/answerController';
import {
  answerCreateSchema,
  answersGetPercentageSchema,
  answersGetSchema
} from '../schemas/answerSchema';

const answersRoute = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/answers/:quizId',
      { schema: answerCreateSchema },
      createAnswerController
    );

  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/answers/:quizId',
      { schema: answersGetSchema },
      getAnswersController
    );

  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/answers/:userId/percentage',
      { schema: answersGetPercentageSchema },
      getAnswersPercentageController
    );
};

export default answersRoute;
