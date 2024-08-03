import mongoose from 'mongoose';
import { z } from 'zod';

import { genMsgError, Required, Type } from '../helpers/genMsgError';
import { apiKeySchema, errorSchema } from './sharedSchema';

const questionSchema = z.object({
  question: z.string(genMsgError('question', Type.STRING, Required.TRUE))
    .min(5, genMsgError('question', Type.MIN, Required.NULL, '5'))
    .max(256, genMsgError('question', Type.MAX, Required.NULL, '256')),
  rightAnswer: z.string(genMsgError('rightAnswer', Type.STRING, Required.TRUE))
    .min(1, genMsgError('rightAnswer', Type.MIN, Required.NULL, '1'))
    .max(256, genMsgError('rightAnswer', Type.MAX, Required.NULL, '256')),
  wrongAnswers: z.array(
    z.string(genMsgError('wrongAnswers', Type.STRING, Required.TRUE))
      .min(1, genMsgError('wrongAnswers', Type.MIN, Required.NULL, '1'))
      .max(256, genMsgError('wrongAnswers', Type.MAX, Required.NULL, '256'))
  ).length(4, genMsgError('wrongAnswers', Type.LENGTH, Required.NULL, '4'))
});

const questionModifiedSchema = z.object({
  question: z.string(genMsgError('question', Type.STRING, Required.TRUE))
    .min(5, genMsgError('question', Type.MIN, Required.NULL, '5'))
    .max(256, genMsgError('question', Type.MAX, Required.NULL, '256')),
  answers: z.array(
    z.string(genMsgError('answers', Type.STRING, Required.TRUE))
      .min(1, genMsgError('answers', Type.MIN, Required.NULL, '1'))
      .max(256, genMsgError('answers', Type.MAX, Required.NULL, '256'))
  ).length(5, genMsgError('answers', Type.LENGTH, Required.NULL, '5'))
});

const quizSchema = z.object({
  userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
    .min(24, genMsgError('userId', Type.MIN, Required.NULL, '24'))
    .max(24, genMsgError('userId', Type.MAX, Required.NULL, '24')),
  quizTitle: z.string(genMsgError('quizTitle', Type.STRING, Required.TRUE))
    .min(5, genMsgError('quizTitle', Type.MIN, Required.NULL, '5'))
    .max(64, genMsgError('quizTitle', Type.MAX, Required.NULL, '64')),
  questions: z.array(questionModifiedSchema).min(1, genMsgError('questions', Type.MIN, Required.NULL, '1'))
})
  .describe(`<pre><code><b>*userId:</b> string
<b>*quizTitle:</b> string (min: 5, max: 64)
<b>*questions:</b> [
  <b>*question:</b> string (min: 5, max: 256)
  <b>*rightAnswer:</b> string (min: 1, max: 256)
  <b>*wrongAnswers:</b> [
    string (min: 1, max: 256),
    string (min: 1, max: 256),
    string (min: 1, max: 256),
    string (min: 1, max: 256)
  ]
]
</code></pre>`);

const quizResponseSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId, genMsgError('_id', Type.STRING, Required.NULL)),
  userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE)),
  quizTitle: z.string(genMsgError('quizTitle', Type.STRING, Required.TRUE))
    .min(5, genMsgError('quizTitle', Type.MIN, Required.NULL, '5'))
    .max(64, genMsgError('quizTitle', Type.MAX, Required.NULL, '64')),
  questions: z.array(questionSchema),
  createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
})
  .describe(`<pre><code><b>*_id:</b> string
<b>*userId:</b> string
<b>*quizTitle:</b> string
<b>*questions:</b> [{
  <b>*question:</b> string
  <b>*answers:</b> [
    string,
    string,
    string,
    string,
    string
  ]
}]
<b>*createdAt:</b> Date
</code></pre>`);

const quizResponseModifiedSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId, genMsgError('_id', Type.STRING, Required.NULL)),
  userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE)),
  quizTitle: z.string(genMsgError('quizTitle', Type.STRING, Required.TRUE))
    .min(5, genMsgError('quizTitle', Type.MIN, Required.NULL, '5'))
    .max(64, genMsgError('quizTitle', Type.MAX, Required.NULL, '64')),
  questions: z.array(questionModifiedSchema),
  createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
})
  .describe(`<pre><code><b>*_id:</b> string
<b>*userId:</b> string
<b>*quizTitle:</b> string
<b>*questions:</b> [{
  <b>*question:</b> string
  <b>*answers:</b> [
    string,
    string,
    string,
    string,
    string
  ]
}]
<b>*createdAt:</b> Date
</code></pre>`);

const quizResponseAdminSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId, genMsgError('_id', Type.STRING, Required.NULL)),
  quizTitle: z.string(genMsgError('quizTitle', Type.STRING, Required.TRUE))
    .min(5, genMsgError('quizTitle', Type.MIN, Required.NULL, '5'))
    .max(64, genMsgError('quizTitle', Type.MAX, Required.NULL, '64')),
  createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
})
  .describe(`<pre><code><b>*_id:</b> string
<b>*quizTitle:</b> string
<b>*createdAt:</b> Date
</code></pre>`);

const quizGetAllResponseSchema = z.object({
  quizzes: z.array(quizResponseAdminSchema),
  totalPages: z.number(genMsgError('totalPages', Type.NUMBER, Required.TRUE))
    .int(genMsgError('totalPages', Type.INT, Required.NULL))
    .positive(genMsgError('totalPages', Type.POSITIVE, Required.NULL)),
  currentPage: z.number(genMsgError('currentPage', Type.NUMBER, Required.TRUE))
    .int(genMsgError('currentPage', Type.INT, Required.NULL))
    .positive(genMsgError('currentPage', Type.POSITIVE, Required.NULL))
})
  .describe(`<pre><code><b>*quizzes:</b> [
  <b>*_id:</b> string
  <b>*userId:</b> string
  <b>*quizTitle:</b> string
  <b>*questions:</b> [{
    <b>*question:</b> string
    <b>*rightAnswer:</b> string
    <b>*wrongAnswers:</b> [
      string,
      string,
      string,
      string
    ]
  }]
  <b>*createdAt:</b> Date
]
<b>*totalPages:</b> number
<b>*currentPage:</b> number
</code></pre>`);

const quizCreateSchema = {
  summary: 'Criar quiz',
  tags: ['Quizzes'],
  body: quizSchema,
  headers: apiKeySchema,
  response: {
    201: quizResponseSchema,
    400: errorSchema,
    401: errorSchema
  }
};

const quizGetAllSchema = {
  summary: 'Buscar todos os quizzes de um usuário',
  tags: ['Quizzes'],
  querystring: z.object({
    page: z.string(genMsgError('page', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*page:</b> string</code></pre>')
  }),
  params: z.object({
    userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*userId:</b> string</code></pre>')
  }),
  headers: apiKeySchema,
  response: {
    200: quizGetAllResponseSchema,
    400: errorSchema,
    401: errorSchema
  }
};

const quizGetSchema = {
  summary: 'Buscar quiz por id',
  tags: ['Quizzes'],
  params: z.object({
    quizId: z.string(genMsgError('quizId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*quizId:</b> string</code></pre>')
  }),
  headers: apiKeySchema,
  response: {
    200: quizResponseModifiedSchema,
    400: errorSchema,
    401: errorSchema,
    404: errorSchema
  }
};

export {
  quizCreateSchema,
  quizGetAllSchema,
  quizGetSchema
};
