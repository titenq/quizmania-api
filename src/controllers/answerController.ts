import { FastifyRequest, FastifyReply } from 'fastify';

import errorHandler from '../helpers/errorHandler';
import answerService from '../services/answerService';
import { IGenericError } from '../interfaces/errorInterface';
import {
  IAnswerBody,
  IAnswerCreate,
  IAnswerHeaders,
  IAnswerParams,
  IAnswersResponse
} from '../interfaces/answerInterface';

const createAnswerController = async (
  request: FastifyRequest<{ Body: IAnswerBody, Params: IAnswerParams, Headers: IAnswerHeaders }>,
  reply: FastifyReply
) => {
  try {
    const { answers } = request.body;
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

    const totalAnswers = answers?.length;
    const rightAnswers = answers.filter(answer => answer.isRight)?.length;
    const wrongAnswers = totalAnswers - rightAnswers;

    const answerCreate: IAnswerCreate = {
      quizId,
      answers,
      totalAnswers: totalAnswers,
      rightAnswers: rightAnswers,
      wrongAnswers: wrongAnswers
    };

    const quizAnswers = await answerService.createAnswers(answerCreate);

    reply.status(201).send(quizAnswers);
  } catch (error) {
    errorHandler(error, request, reply);
  }
};

const getAnswersController = async (
  request: FastifyRequest<{ Params: IAnswerParams, Headers: IAnswerHeaders }>,
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

    const response: IAnswersResponse[] | IGenericError = await answerService.getAnswers({ quizId });

    if ((response as IGenericError).error) {
      return errorHandler(response, request, reply)
    }

    reply.status(200).send(response);
  } catch (error) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'erro ao buscar respostas',
      statusCode: 400
    };

    errorHandler(errorMessage, request, reply);
  }
};

export {
  createAnswerController,
  getAnswersController
};
