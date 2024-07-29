import QuizModel from '../models/QuizModel';
import { IGenericError } from '../interfaces/errorInterface';
import {
  IQuiz,
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
      const messageError: IGenericError = {
        message: 'Erro ao criar quiz',
        statusCode: 400
      };

      return messageError;
    }
  },

  getAllQuiz: async (query: IQuizGetAll) => {
    try {
      const { userId, page } = query;

      const quizzes = await QuizModel
        .find({ userId })
        .limit(20)
        .skip((Number(page) - 1) * 20)
        .sort({ createdAt: 'desc' });

      const count = await QuizModel.countDocuments({ userId });

      const quizzesPaged: IQuizGetAllResponse = {
        quizzes,
        totalPages: Math.ceil(count / 20),
        currentPage: Number(page)
      };

      return quizzesPaged;
    } catch (error) {
      const messageError: IGenericError = {
        message: 'Erro ao criar quiz',
        statusCode: 400
      };

      return messageError;
    }
  }
};

export default quizService;
