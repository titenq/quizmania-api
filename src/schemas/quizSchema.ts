import { z } from 'zod';
import { genMsgError, Required, Type } from '../helpers/genMsgError';

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

const quizSchema = z.object({
  userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
    .min(24, genMsgError('userId', Type.MIN, Required.NULL, '24'))
    .max(24, genMsgError('userId', Type.MAX, Required.NULL, '24')),
  quizTitle: z.string(genMsgError('quizTitle', Type.STRING, Required.TRUE))
    .min(5, genMsgError('quizTitle', Type.MIN, Required.NULL, '5'))
    .max(64, genMsgError('quizTitle', Type.MAX, Required.NULL, '64')),
  questions: z.array(questionSchema).min(1, genMsgError('questions', Type.MIN, Required.NULL, '1'))
});

const quizCreateSchema = {
  summary: 'Criar quiz',
  tags: ['Quizzes'],
  body: quizSchema
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
</code></pre>`),
  headers: z.object({
    api_key: z.string(genMsgError('api_key', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*api_key:</b> string</code></pre>')
  }),
  response: {
    201: z.object({
      _id: z.string(genMsgError('_id', Type.STRING, Required.TRUE)),
      quizSchema,
      createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
    })
      .describe(`<pre><code><b>*_id:</b> string
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
</code></pre>`),
    400: z.object({
      message: z.string(genMsgError('message', Type.STRING, Required.TRUE)),
      statusCode: z.number(genMsgError('statusCode', Type.NUMBER, Required.TRUE))
    })
      .describe(`<pre><code><b>*message:</b> string
<b>*statusCode:</b> number
</code></pre>`)
  }
};

const quizGetAllSchema = {
  summary: 'Buscar todos os quizzes',
  tags: ['Quizzes'],
  params: z.object({
    userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*userId:</b> string</code></pre>'),
    page: z.number(genMsgError('page', Type.NUMBER, Required.TRUE))
      .int(genMsgError('page', Type.INT, Required.NULL))
      .positive(genMsgError('page', Type.POSITIVE, Required.NULL))
      .describe('<pre><code><b>*page:</b> number</code></pre>')
  }),
  response: {
    200: z.object({
      quizzes: z.array(quizSchema),
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
</code></pre>`),
    400: z.object({
      message: z.string(genMsgError('message', Type.STRING, Required.TRUE)),
      statusCode: z.number(genMsgError('statusCode', Type.NUMBER, Required.TRUE))
    })
      .describe(`<pre><code><b>*message:</b> string
<b>*statusCode:</b> number
</code></pre>`)
  }
};

export {
  quizCreateSchema,
  quizGetAllSchema
};
