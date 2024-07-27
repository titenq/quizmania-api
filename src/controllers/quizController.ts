import { FastifyRequest, FastifyReply } from 'fastify';

import errorHandler from '../helpers/errorHandler';
import quizService from '../services/quizService';
import { IGenericError } from '../interfaces/errorInterface';
import { IQuiz, IQuizHeaders } from '../interfaces/quizInterface';

export const createQuizController = async (
  request: FastifyRequest<{ Body: IQuiz, Headers: IQuizHeaders }>,
  reply: FastifyReply
) => {
  try {
    const { userId, quizTitle, questions } = request.body;
    const { api_key } = request.headers;
    const { API_KEY } = process.env;

    if (api_key !== API_KEY) {
      const errorMessage: IGenericError = {
        message: 'api_key inválida',
        statusCode: 401
      };

      return errorHandler(errorMessage, request, reply);
    }

    const quiz = await quizService.createQuiz({
      userId: userId.toString(),
      quizTitle,
      questions
    });

    reply.status(200).send(quiz);
  } catch (error) {
    errorHandler(error, request, reply);
  }
};
