import mongoose from 'mongoose';

export interface IAnswer {
  question: string;
  answer: string;
  isRight: boolean;
}

export interface IAnswerBody {
  answers: IAnswer[];
}

export interface IAnswerHeaders {
  api_key: string;
}

export interface IAnswerParams {
  quizId: string;
}

export interface IAnswerCreate extends IAnswerParams, IAnswerBody {
  totalAnswers: number;
  rightAnswers: number;
  wrongAnswers: number;
}

export interface IAnswersResponse extends IAnswerParams, IAnswerBody {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
}
