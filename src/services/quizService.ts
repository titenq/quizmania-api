import mongoose from 'mongoose';

import QuizModel from '../models/QuizModel';
import { IGenericError } from '../interfaces/errorInterface';
import {
  IQuiz,
  IQuizGet,
  IQuizGetAll,
  IQuizGetAllResponse,
  IQuizResponse
} from '../interfaces/quizInterface';

const quizService = {
  createQuiz: async (quiz: IQuiz) => {
    try {
      const quizCreated: IQuizResponse = await QuizModel.create(quiz);

      return quizCreated;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'Erro ao criar quiz',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  getAllQuiz: async (query: IQuizGetAll) => {
    try {
      const { userId, page } = query;
      const count = await QuizModel.countDocuments({ userId });

      if (count === 0) {
        const quizzesPaged: IQuizGetAllResponse = {
          quizzes: [],
          totalPages: 1,
          currentPage: 1
        };

        return quizzesPaged;
      }

      const quizzes: IQuizResponse[] = await QuizModel
        .find({ userId })
        .limit(20)
        .skip((Number(page) - 1) * 20)
        .sort({ createdAt: 'desc' });


      const quizzesPaged: IQuizGetAllResponse = {
        quizzes,
        totalPages: Math.ceil(count / 20),
        currentPage: Number(page)
      };

      return quizzesPaged;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'Erro ao criar quiz',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  getQuiz: async (query: IQuizGet): Promise<IQuizResponse | IGenericError> => {
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

      const response: IQuizResponse | null = await QuizModel.findById({ _id: quizId });

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
  }
};

export default quizService;
