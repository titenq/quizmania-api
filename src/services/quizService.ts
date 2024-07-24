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
  },

  /* getUserByEmail: async (email: string) => {
    try {
      const user: IUserResponse | null = await UserModel.findOne({ email });

      return user;
    } catch (error) {
      return { error: 'Erro ao buscar usuário por e-mail' };
    }
  }, */
};

export default quizService;
