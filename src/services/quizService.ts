import QuizModel from '../models/QuizModel';
import { IQuiz, IQuizResponse } from '../interfaces/quizInterface';

const quizService = {
  createQuiz: async (quiz: IQuiz) => {
    try {
      const quizCreated: IQuizResponse = await QuizModel.create(quiz);

      return quizCreated;
    } catch (error) {
      return { error: 'Erro ao criar quiz' };
    }
  }
};

export default quizService;
