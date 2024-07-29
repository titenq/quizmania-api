import mongoose from 'mongoose';

export interface IQuestion {
  question: string;
  rightAnswer: string;
  wrongAnswers: string[];
}

export interface IQuiz {
  userId: string;
  quizTitle: string;
  questions: IQuestion[];
}

export interface IQuizResponse extends IQuiz {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface IQuizHeaders {
  api_key: string;
}

export interface IQuizGetAll {
  userId: string;
  page: string;
}

export interface IQuizGetAllResponse {
  quizzes: IQuizResponse[];
  totalPages: number;
  currentPage: number;
}

export interface IQuizGetAllQuery {
  page: string;
}

export interface IQuizGetAllParams {
  userId: string;
}
