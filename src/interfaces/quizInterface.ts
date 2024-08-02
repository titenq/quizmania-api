import mongoose from 'mongoose';

export interface IQuestion {
  question: string;
  rightAnswer: string;
  wrongAnswers: string[];
}

export interface IQuestionModified {
  question: string;
  answers: string[];
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

export interface IQuizModifiedResponse {
  _id: mongoose.Types.ObjectId;
  userId: string;
  quizTitle: string;
  questions: IQuestionModified[];
  createdAt: Date;
}

export interface IQuizHeaders {
  api_key: string;
}

export interface IQuizGetAll {
  userId: string;
  page: string;
}

export interface IQuizGet {
  quizId: string;
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

export interface IQuizGetParams {
  quizId: string;
}
