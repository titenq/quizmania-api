import mongoose from 'mongoose';

import QuizModel from '../models/QuizModel';
import { IGenericError } from '../interfaces/errorInterface';
import {
  IQuiz,
  IQuizAdmin,
  IQuizAdminResponse,
  IQuizAnswer,
  IQuizGet,
  IQuizGetAll,
  IQuizGetAllQuery,
  IQuizGetAllResponse,
  IQuizGetLatestQuery,
  IQuizLatest,
  IQuizLatestResponse,
  IQuizModifiedResponse,
  IQuizResponse
} from '../interfaces/quizInterface';
import shuffleAnswers from '../helpers/shuffleAnswers';
import { IAnswersResponse } from '../interfaces/answerInterface';
import answerService from './answerService';
import { calculateAnswersPercentages } from '../helpers/calculatePercentage';

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

  getAllByUserIdQuiz: async (query: IQuizGetAll) => {
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
        .limit(10)
        .skip((Number(page) - 1) * 10)
        .sort({ createdAt: 'desc' });

      const quizzesPaged: IQuizAdminResponse = {
        quizzes,
        totalPages: Math.ceil(count / 10),
        currentPage: Number(page)
      };

      return quizzesPaged;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'Erro ao listar quizzes pelo ID do usuário',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  getAllQuiz: async (query: IQuizGetAllQuery) => {
    try {
      const { page } = query;
      const count = await QuizModel.countDocuments();

      if (count === 0) {
        const quizzesPaged: IQuizGetAllResponse = {
          quizzes: [],
          totalPages: 1,
          currentPage: 1
        };

        return quizzesPaged;
      }

      const quizzes: IQuizAdmin[] = await QuizModel
        .find({}, '_id quizTitle createdAt')
        .limit(10)
        .skip((Number(page) - 1) * 10)
        .sort({ createdAt: 'desc' });

      const quizzesPaged: IQuizAdminResponse = {
        quizzes,
        totalPages: Math.ceil(count / 10),
        currentPage: Number(page)
      };

      return quizzesPaged;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'Erro ao listar quizzes',
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
  },

  answerQuiz: async (answerResponse: IQuizAnswer): Promise<{ isRight: boolean, rightAnswer: string } | IGenericError> => {
    try {
      const { quizId, question, answer } = answerResponse;

      const quiz = await QuizModel.findOne(
        { _id: quizId, 'questions.question': question },
        { 'questions.$': 1 }
      );

      if (!quiz) {
        const errorMessage: IGenericError = {
          error: true,
          message: 'Quiz ou questão não encontrados',
          statusCode: 404
        };

        return errorMessage;
      }

      const correctAnswer = quiz.questions[0].rightAnswer;

      return {
        isRight: correctAnswer === answer,
        rightAnswer: correctAnswer
      };
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'Erro ao verificar a resposta',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  getLatestQuizzes: async (query: IQuizGetLatestQuery): Promise<IQuizLatestResponse[] | IGenericError> => {
    try {
      const { limit } = query;

      const quizzes: IQuizLatest[] = await QuizModel.find({}, '_id userId quizTitle createdAt')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      const fetchTotalAnswers: IAnswersResponse[][] = [];
      const quizzesId = quizzes.map(item => item._id.toString());

      for await (const id of quizzesId) {
        const fetchAnswers = await answerService.getAnswers({ quizId: id });

        if ('error' in fetchAnswers) {
          const errorMessage: IGenericError = {
            error: true,
            message: 'Erro ao verificar a resposta',
            statusCode: 400
          };

          return errorMessage;
        }

        fetchTotalAnswers.push(fetchAnswers);
      }

      const percentages = calculateAnswersPercentages(fetchTotalAnswers);

      const quizzesWithPercentages = quizzes.map((quiz, index) => ({
        ...quiz,
        percentages: percentages[index]
      }));

      return quizzesWithPercentages;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'Erro ao buscar últimos quizzes',
        statusCode: 400
      };

      return errorMessage;
    }
  },

  getTopQuizzes: async () => {
    try {
      const quizzes: IQuizLatest[] = await QuizModel.aggregate([
        {
          $lookup: {
            from: 'answers',
            localField: '_id',
            foreignField: 'quizId',
            as: 'answers'
          }
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            quizTitle: 1,
            createdAt: 1
          }
        }
      ]);

      const formattedQuizzes = [];

      for await (const quiz of quizzes) {
        const fetchAnswers = await answerService.getAnswers({ quizId: quiz._id.toString() });

        if ('error' in fetchAnswers) {
          const errorMessage: IGenericError = {
            error: true,
            message: 'Erro ao verificar a resposta',
            statusCode: 400
          };

          return errorMessage;
        }

        const [percentages] = calculateAnswersPercentages([fetchAnswers]);

        formattedQuizzes.push({
          _id: quiz._id,
          userId: quiz.userId,
          quizTitle: quiz.quizTitle,
          createdAt: quiz.createdAt,
          percentages
        });
      }

      formattedQuizzes
        .sort((a, b) => b.percentages.answersLength - a.percentages.answersLength)
        .slice(0, 10);

      return formattedQuizzes;
    } catch (error) {
      const errorMessage: IGenericError = {
        error: true,
        message: 'Erro ao buscar os quizzes mais respondidos',
        statusCode: 400
      };

      return errorMessage;
    }
  }
};

export default quizService;
