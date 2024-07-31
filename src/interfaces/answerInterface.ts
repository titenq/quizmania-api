import mongoose from 'mongoose';

export interface IAnswer {
  question: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

export interface IAnswerBody {
  quizId: string;
  answers: IAnswer[];
}

export interface IAnswerHeaders {
  api_key: string;
}

export interface IAnswersResponse extends IAnswerBody {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
}
