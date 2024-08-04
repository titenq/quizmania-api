import { FastifyRequest, FastifyReply } from 'fastify';

import errorHandler from '../helpers/errorHandler';
import quizService from '../services/quizService';
import { IGenericError } from '../interfaces/errorInterface';
import {
  IQuiz,
  IQuizAnswer,
  IQuizBodyAnswer,
  IQuizGetAllParams,
  IQuizGetAllQuery,
  IQuizGetParams,
  IQuizHeaders,
  IQuizModifiedResponse,
  IQuizResponse
} from '../interfaces/quizInterface';

const createQuizController = async (
  request: FastifyRequest<{ Body: IQuiz, Headers: IQuizHeaders }>,
  reply: FastifyReply
) => {
  try {
    const { userId, quizTitle, questions } = request.body;
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

const getAllQuizController = async (
  request: FastifyRequest<{ Querystring: IQuizGetAllQuery, Params: IQuizGetAllParams, Headers: IQuizHeaders }>,
  reply: FastifyReply
) => {
  try {
    const { page } = request.query;
    const { userId } = request.params;
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

    const quizzes = await quizService.getAllQuiz({ userId, page });

    reply.status(200).send(quizzes);
  } catch (error) {
    errorHandler(error, request, reply);
  }
};

const getQuizController = async (
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

    const response: IQuizModifiedResponse | IGenericError = await quizService.getQuiz({ quizId });

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
};

const answerQuizController = async (
  request: FastifyRequest<{ Params: IQuizGetParams, Body: IQuizBodyAnswer, Headers: IQuizHeaders }>,
  reply: FastifyReply
) => {
  try {
    const { quizId } = request.params;
    const { question, answer } = request.body;
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

    const response = await quizService.answerQuiz({
      quizId,
      question,
      answer
    });

    if ((response as IGenericError).error) {
      return errorHandler(response, request, reply)
    }

    reply.status(200).send(response);
  } catch (error) {
    errorHandler(error, request, reply);
  }
};

export {
  createQuizController,
  getAllQuizController,
  getQuizController,
  answerQuizController
};
