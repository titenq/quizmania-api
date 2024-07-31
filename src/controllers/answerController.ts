import { FastifyRequest, FastifyReply } from 'fastify';

import errorHandler from '../helpers/errorHandler';
import answerService from '../services/answerService';
import { IGenericError } from '../interfaces/errorInterface';
import { IAnswerBody, IAnswerHeaders } from '../interfaces/answerInterface';

const createAnswerController = async (
  request: FastifyRequest<{ Body: IAnswerBody, Headers: IAnswerHeaders }>,
  reply: FastifyReply
) => {
  try {
    const { quizId, answers } = request.body;
    const { api_key } = request.headers;
    const { API_KEY } = process.env;

    if (api_key !== API_KEY) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'api_key inválida',
        statusCode: 401
      };

      return errorHandler(errorMessage, request, reply);
    }

    const quizAnswers = await answerService.createAnswers({
      quizId: quizId.toString(),
      answers
    });

    reply.status(200).send(quizAnswers);
  } catch (error) {
    errorHandler(error, request, reply);
  }
};

/* const getAnswerController = async (
  request: FastifyRequest<{ Params: IQuizGetParams, Headers: IQuizHeaders }>,
  reply: FastifyReply
) => {
  try {
    const { quizId } = request.params;
    const { api_key } = request.headers;
    const { API_KEY } = process.env;

    if (api_key !== API_KEY) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'api_key inválida',
        statusCode: 401
      };

      return errorHandler(errorMessage, request, reply);
    }

    const response: IQuizResponse | IGenericError = await quizService.getQuiz({ quizId });

    if ((response as IGenericError).error) {
      return errorHandler(response, request, reply)
    }

    reply.status(200).send(response);
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao buscar quiz',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
}; */

export {
  createAnswerController,
  // getAnswerController
};
