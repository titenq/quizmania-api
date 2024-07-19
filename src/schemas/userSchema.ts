import { z } from 'zod';
import { genMsgError, Required, Type } from '../helpers/genMsgError';

const userCreateSchema = {
  summary: 'Criar usuário',
  tags: ['Usuários'],
  body: z.object({
    name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
    email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
    picture: z.string(genMsgError('picture', Type.STRING, Required.FALSE)).nullish()
  })
    .describe(`
<b>&#42;name:</b> string
<b>&#42;email:</b> string
<b>picture:</b> string`
    ),
  headers: z.object({
    api_key: z.string(genMsgError('api_key', Type.STRING, Required.TRUE))
  })
    .describe('<b>&#42;api_key:</b> string'),
  response: {
    201: z.object({
      _id: z.string(genMsgError('_id', Type.STRING, Required.TRUE)),
      name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
      email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
      picture: z.string(genMsgError('picture', Type.STRING, Required.FALSE)).nullish(),
      createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
    })
      .describe(`
<b>&#42;_id:</b> string
<b>&#42;name:</b> string
<b>&#42;email:</b> string
<b>picture:</b> string
<b>&#42;createdAt:</b> Date`
      ),
    401: z.object({
      error: z.string(genMsgError('error', Type.STRING, Required.TRUE))
    })
      .describe('<b>&#42;error:</b> string')
  }
};

const userGetByEmailSchema = {
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
};

export {
  userCreateSchema,
  userGetByEmailSchema
};
