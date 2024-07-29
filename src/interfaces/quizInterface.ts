import { Types } from 'mongoose';

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

export interface IQuizHeaders {
  api_key: string;
}

export interface IQuizResponse {
  _id: Types.ObjectId;
  userId: string;
  quizTitle: string;
  questions: IQuestion[];
  createdAt: Date;
}

export interface IQuizGetAll {
  userId: string;
  page: string;
}

export interface IQuizGetAllResponse {
  quizzes: IQuiz[];
  totalPages: number;
  currentPage: number;
}

export interface IQuizGetAllQuery {
  page: string;
}

export interface IQuizGetAllParams {
  userId: string;
}
