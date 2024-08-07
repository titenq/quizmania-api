import mongoose from 'mongoose';

import AnswersModel from '../models/AnswersModel';
import { IGenericError } from '../interfaces/errorInterface';
import { IAnswerCreate, IAnswerParams, IAnswersPercentageResponse, IAnswersResponse } from '../interfaces/answerInterface';
import { calculateAnswersPercentages } from '../helpers/calculatePercentage';
import quizService from './quizService';
import { IQuizGetAll } from '../interfaces/quizInterface';

const answerService = {
  createAnswers: async (answers: IAnswerCreate) => {
    try {
      const answersCreated: IAnswersResponse = await AnswersModel.create(answers);

      return answersCreated;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'Erro ao criar quiz',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  getAnswers: async (quiz_id: IAnswerParams): Promise<IAnswersResponse[] | IGenericError> => {
    try {
      const { quizId } = quiz_id;

      if (!mongoose.isValidObjectId(quizId)) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'Quiz ID com formato inválido',
          statusCode: 404
        };

        return errorMessage;
      }

      const response: IAnswersResponse[] | null = await AnswersModel.find({ quizId });

      if (!response) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'Não existe resposta para esse quizId',
          statusCode: 404
        };

        return errorMessage;
      }

      return response;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'Erro ao buscar resposta',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  getAnswersPercentage: async (data: IQuizGetAll): Promise<IAnswersPercentageResponse[] | IGenericError> => {
    try {
      const response = await quizService.getAllQuiz(data);

      if ('error' in response) {
        const errorMessage: IGenericError = {
          error: true,
          message: response.message,
          statusCode: response.statusCode
        };

        return errorMessage;
      }

      if (!response) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'Não existe resposta para esse quiz',
          statusCode: 404,
        };

        return errorMessage;
      }

      const fetchTotalAnswers: IAnswersResponse[][] = [];

      if ('quizzes' in response) {
        const quizzesId = response.quizzes.map(item => item._id.toString());

        for await (const id of quizzesId) {
          const fetchAnswers = await answerService.getAnswers({ quizId: id });

          if ('error' in fetchAnswers) {
            const errorMessage: IGenericError = {
              error: true,
              message: fetchAnswers.message,
              statusCode: fetchAnswers.statusCode
            };

            return errorMessage;
          }

          fetchTotalAnswers.push(fetchAnswers);
        }
      }

      const percentages = calculateAnswersPercentages(fetchTotalAnswers);

      return percentages;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'Erro ao calcular percentuais',
        statusCode: 400
      };

      return errorMessage;
    }
  }
};

export default answerService;
