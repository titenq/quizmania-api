import mongoose from 'mongoose';

import QuizModel from '../models/QuizModel';
import { IGenericError } from '../interfaces/errorInterface';
import {
  IQuiz,
  IQuizAdmin,
  IQuizAdminResponse,
  IQuizGet,
  IQuizGetAll,
  IQuizGetAllResponse,
  IQuizModifiedResponse,
  IQuizResponse
} from '../interfaces/quizInterface';
import shuffleAnswers from '../helpers/shuffleAnswers';

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

      const quizzes: IQuizAdmin[] = await QuizModel
        .find({ userId }, '_id quizTitle createdAt')
        .limit(20)
        .skip((Number(page) - 1) * 20)
        .sort({ createdAt: 'desc' });

      const quizzesPaged: IQuizAdminResponse = {
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

  getQuiz: async (query: IQuizGet): Promise<IQuizModifiedResponse | IGenericError> => {
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

      const quiz: IQuizResponse | null = await QuizModel.findById({ _id: quizId });

      if (!quiz) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'Não existe quiz com esse ID',
          statusCode: 404
        };

        return errorMessage;
      }

      const modifiedQuiz: IQuizModifiedResponse = {
        _id: quiz._id,
        userId: quiz.userId.toString(),
        quizTitle: quiz.quizTitle,
        questions: quiz.questions.map((question) => ({
          question: question.question,
          answers: shuffleAnswers([question.rightAnswer, ...question.wrongAnswers]),
        })),
        createdAt: quiz.createdAt,
      };

      return modifiedQuiz;
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
