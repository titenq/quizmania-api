import mongoose from 'mongoose';
import { z } from 'zod';

import { genMsgError, Required, Type } from '../helpers/genMsgError';
import { apiKeySchema, errorSchema, userIdSchema } from './sharedSchema';

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
  userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
    .min(24, genMsgError('userId', Type.MIN, Required.NULL, '24'))
    .max(24, genMsgError('userId', Type.MAX, Required.NULL, '24')),
  answers: z.array(answersSchema).min(1, genMsgError('answers', Type.MIN, Required.NULL, '1'))
})
  .describe(`<pre><code><b>*userId:</b> string
<b>*questions:</b> [
  <b>*question:</b> string (min: 5, max: 256)
  <b>*answer:</b> string (min: 1, max: 256)
  <b>*isRight:</b> boolean
]
</code></pre>`);

const answerResponseSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId, genMsgError('_id', Type.STRING, Required.NULL)),
  quizId: z.string(genMsgError('quizId', Type.STRING, Required.TRUE)),
  answers: z.array(answerSchema),
  totalAnswers: z.number(genMsgError('totalAnswers', Type.NUMBER, Required.TRUE)),
  rightAnswers: z.number(genMsgError('rightAnswers', Type.NUMBER, Required.TRUE)),
  wrongAnswers: z.number(genMsgError('wrongAnswers', Type.NUMBER, Required.TRUE)),
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

const answerCreateSchema = {
  summary: 'Salvar respostas',
  tags: ['Answers'],
  params: userIdSchema,
  body: answerSchema,
  headers: apiKeySchema,
  response: {
    201: answerResponseSchema,
    400: errorSchema,
    401: errorSchema
  }
};

export {
  answerCreateSchema
};
