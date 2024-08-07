import mongoose from 'mongoose';

import AnswersModel from '../models/AnswersModel';
import { IGenericError } from '../interfaces/errorInterface';
import { IAnswerCreate, IAnswerParams, IAnswersResponse } from '../interfaces/answerInterface';

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
  }
};

export default answerService;
