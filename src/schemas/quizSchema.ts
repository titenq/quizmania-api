import { z } from 'zod';
import { genMsgError, Required, Type } from '../helpers/genMsgError';

const quizCreateSchema = {
  summary: 'Criar quiz',
  tags: ['Quizzes'],
  body: z.object({
    userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
      .min(32, genMsgError('userId', Type.MIN, Required.NULL, '32')),
    quizTitle: z.string(genMsgError('quizTitle', Type.STRING, Required.TRUE)),
    questions: z.object({
      question: z.string(genMsgError('question', Type.STRING, Required.TRUE)),
      rightAnswer: z.string(genMsgError('rightAnswer', Type.STRING, Required.TRUE)),
      wrongAnswers: z.array(
        z.string(genMsgError('wrongAnswers', Type.STRING, Required.TRUE)))
          .length(4, genMsgError('wrongAnswers', Type.LENGTH, Required.NULL, '4')
      )
    })
  })
    .describe(`
<b>&#42;userId:</b> string
<b>&#42;quizTitle:</b> string
<b>&#42;questions:</b> {
&nbsp;&nbsp;&nbsp;&nbsp;<b>&#42;question:</b> string
&nbsp;&nbsp;&nbsp;&nbsp;<b>&#42;rightAnswer:</b> string
&nbsp;&nbsp;&nbsp;&nbsp;<b>&#42;wrongAnswers:</b> [
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;string,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;string,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;string,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;string
&nbsp;&nbsp;&nbsp;&nbsp;]
}`
    ),
  headers: z.object({
    api_key: z.string(genMsgError('api_key', Type.STRING, Required.TRUE))
  })
    .describe('<b>&#42;api_key:</b> string'),
  response: {
    201: z.object({
      _id: z.string(genMsgError('_id', Type.STRING, Required.TRUE)),
      userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE)),
      quizTitle: z.string(genMsgError('quizTitle', Type.STRING, Required.TRUE)),
      questions: z.object({
        question: z.string(genMsgError('question', Type.STRING, Required.TRUE)),
        rightAnswer: z.string(genMsgError('rightAnswer', Type.STRING, Required.TRUE)),
        wrongAnswers: z.string(genMsgError('wrongAnswers', Type.STRING, Required.TRUE))
          .array()
          .length(4, genMsgError('wrongAnswers', Type.LENGTH, Required.NULL, '4'))
      }),
      createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
    })
      .describe(`
<b>&#42;_id:</b> string
<b>&#42;userId:</b> string
<b>&#42;quizTitle:</b> string
<b>&#42;questions:</b> {
&nbsp;&nbsp;&nbsp;&nbsp;<b>&#42;question:</b> string
&nbsp;&nbsp;&nbsp;&nbsp;<b>&#42;rightAnswer:</b> string
&nbsp;&nbsp;&nbsp;&nbsp;<b>&#42;wrongAnswers:</b> [
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;string,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;string,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;string,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;string
&nbsp;&nbsp;&nbsp;&nbsp;]
}
<b>&#42;createdAt:</b> Date`
      ),
    401: z.object({
      error: z.string(genMsgError('error', Type.STRING, Required.TRUE))
    })
      .describe('<b>&#42;error:</b> string')
  }
};

/* const userGetByEmailSchema = {
  summary: 'Buscar usuário por e-mail',
  tags: ['Usuários'],
  params: z.object({
    email: z.string(genMsgError('email', Type.STRING, Required.TRUE))
  })
    .describe('<b>&#42;email:</b> string'),
  response: {
    201: z.object({
      _id: z.string(genMsgError('_id', Type.STRING, Required.TRUE)),
      name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
      email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
      picture: z.string(genMsgError('picture', Type.STRING, Required.NULL)).nullish(),
      createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
    })
      .describe(`
<b>&#42;_id:</b> string
<b>&#42;name:</b> string
<b>&#42;email:</b> string
<b>picture:</b> string
<b>&#42;createdAt:</b> Date`
      )
  }
}; */

export {
  quizCreateSchema
};
