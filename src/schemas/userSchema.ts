import { z } from 'zod';
import { genMsgError, Required, Type } from '../helpers/genMsgError';

const userSchema = z.object({
  name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
  email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
  picture: z.string(genMsgError('picture', Type.STRING, Required.FALSE)).nullish()
});

const userResponseSchema = z.object({
  _id: z.string(genMsgError('_id', Type.STRING, Required.TRUE)),
  userSchema,
  createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
});

const userCreateSchema = {
  summary: 'Criar usuário',
  tags: ['Usuários'],
  body: userSchema
    .describe(`<pre><code><b>*name:</b> string
<b>*email:</b> string
<b>picture:</b> string
</code></pre>`),
  headers: z.object({
    api_key: z.string(genMsgError('api_key', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*api_key:</b> string</code></pre>')
  }),
  response: {
    201: userResponseSchema
      .describe(`<pre><code><b>*_id:</b> string
<b>*name:</b> string
<b>*email:</b> string
<b>picture:</b> string
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

const userGetByEmailSchema = {
  summary: 'Buscar usuário por e-mail',
  tags: ['Usuários'],
  params: z.object({
    email: z.string(genMsgError('email', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*email:</b> string</code></pre>')
  }),
  response: {
    201: z.object({
      _id: z.string(genMsgError('_id', Type.STRING, Required.TRUE)),
      name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
      email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
      picture: z.string(genMsgError('picture', Type.STRING, Required.NULL)).nullish(),
      createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
    })
      .describe(`<pre><code><b>*_id:</b> string
<b>*name:</b> string
<b>*email:</b> string
<b>picture:</b> string
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

export {
  userCreateSchema,
  userGetByEmailSchema
};
