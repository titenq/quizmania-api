import mongoose from 'mongoose';

import AnswersModel from '../models/AnswersModel';
import { IGenericError } from '../interfaces/errorInterface';
import { IAnswerBody, IAnswersResponse } from '../interfaces/answerInterface';

const answerService = {
  createAnswers: async (answers: IAnswerBody) => {
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

  /* getAnswers: async (query: IQuizGet): Promise<IQuizResponse | IGenericError> => {
    try {
      const { quizId } = query;

      if (!mongoose.isValidObjectId(quizId)) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'Quiz ID com formato inválido',
          statusCode: 404
        };

        return errorMessage;
      }

      const response: IQuizResponse | null = await AnswersModel.findById({ _id: quizId });

      if (!response) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'Não existe quiz com esse ID',
          statusCode: 404
        };

        return errorMessage;
      }

      return response;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'Erro ao buscar quiz',
        statusCode: 400
      };

      return errorMessage;
    }
  } */
};

export default answerService;
