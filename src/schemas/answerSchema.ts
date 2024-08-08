import mongoose from 'mongoose';
import { z } from 'zod';

import { genMsgError, Required, Type } from '../helpers/genMsgError';
import { apiKeySchema, errorSchema, quizIdSchema, userIdSchema } from './sharedSchema';

const answersSchema = z.object({
  question: z.string(genMsgError('question', Type.STRING, Required.TRUE))
    .min(5, genMsgError('question', Type.MIN, Required.NULL, '5'))
    .max(256, genMsgError('question', Type.MAX, Required.NULL, '256')),
  answer: z.string(genMsgError('answer', Type.STRING, Required.TRUE))
    .min(1, genMsgError('answer', Type.MIN, Required.NULL, '1'))
    .max(256, genMsgError('answer', Type.MAX, Required.NULL, '256')),
  isRight: z.boolean(genMsgError('isRight', Type.BOOLEAN, Required.TRUE))
});

const answerSchema = z.object({
  answers: z.array(answersSchema)
})
  .describe(`<pre><code><b>*answers:</b>[
  <b>*question:</b> string (min: 5, max: 256)
  <b>*answer:</b> string (min: 1, max: 256)
  <b>*isRight:</b> boolean
]
</code></pre>`);

const answerResponseSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId, genMsgError('_id', Type.STRING, Required.NULL)),
  quizId: z.string(genMsgError('quizId', Type.STRING, Required.TRUE)),
  answers: z.array(answersSchema),
  totalAnswers: z.number(genMsgError('totalAnswers', Type.NUMBER, Required.TRUE)),
  rightAnswers: z.number(genMsgError('rightAnswers', Type.NUMBER, Required.TRUE)),
  wrongAnswers: z.number(genMsgError('wrongAnswers', Type.NUMBER, Required.TRUE)),
  createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
})
  .describe(`<pre><code><b>*_id:</b> string
<b>*quizId:</b> string
<b>*answers:</b> [
  {
    <b>*userId:</b> string
    <b>*answers:</b> [
      {
        <b>*question:</b> string (min: 5, max: 256)
        <b>*answer:</b> string (min: 1, max: 256)
        <b>*isRight:</b> boolean
      }
    ]
  }
]
<b>*createdAt:</b> Date
</code></pre>`);

const answersGetResponseSchema = z.array(
  z.object({
    _id: z.instanceof(mongoose.Types.ObjectId, genMsgError('_id', Type.STRING, Required.NULL)),
    quizId: z.string(genMsgError('quizId', Type.STRING, Required.TRUE)),
    answers: z.array(answersSchema),
    totalAnswers: z.number(genMsgError('totalAnswers', Type.NUMBER, Required.TRUE)),
    rightAnswers: z.number(genMsgError('rightAnswers', Type.NUMBER, Required.TRUE)),
    wrongAnswers: z.number(genMsgError('wrongAnswers', Type.NUMBER, Required.TRUE)),
    createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
}))
  .describe(`<pre><code>[
  <b>*_id:</b> string
  <b>*quizId:</b> string
  <b>*answers:</b> [
    {
      <b>*userId:</b> string
      <b>*answers:</b> [
        {
          <b>*question:</b> string (min: 5, max: 256)
          <b>*answer:</b> string (min: 1, max: 256)
          <b>*isRight:</b> boolean
        }
      ]
    }
  ],
  <b>*totalAnswers:</b> number
  <b>*rightAnswers:</b> number
  <b>*wrongAnswers:</b> number
  <b>*createdAt:</b> Date
]
</code></pre>`);

const answersGetPercentageResponseSchema = z.array(
  z.object({
    answersLength: z.number(genMsgError('answersLength', Type.NUMBER, Required.TRUE)),
    percentRight: z.number(genMsgError('percentRight', Type.NUMBER, Required.TRUE)),
    percentWrong: z.number(genMsgError('percentWrong', Type.NUMBER, Required.TRUE))
}))
  .describe(`<pre><code>[
  {
    <b>*answersLength:</b> number
    <b>*percentRight:</b> number
    <b>*percentWrong:</b> number
  }
]
</code></pre>`);

const answerCreateSchema = {
  summary: 'Salvar respostas',
  tags: ['Answers'],
  params: quizIdSchema,
  body: answerSchema,
  headers: apiKeySchema,
  response: {
    201: answerResponseSchema,
    400: errorSchema,
    401: errorSchema
  }
};

const answersGetSchema = {
  summary: 'Listar respostas por quizId',
  tags: ['Answers'],
  params: quizIdSchema,
  headers: apiKeySchema,
  response: {
    200: answersGetResponseSchema,
    400: errorSchema,
    401: errorSchema,
    404: errorSchema
  }
};

const answersGetPercentageSchema = {
  summary: 'Listar percentuais por userId',
  tags: ['Answers'],
  params: userIdSchema,
  headers: apiKeySchema,
  response: {
    200: answersGetPercentageResponseSchema,
    400: errorSchema,
    401: errorSchema,
    404: errorSchema
  }
};

export {
  answerCreateSchema,
  answersGetSchema,
  answersGetPercentageSchema
};
