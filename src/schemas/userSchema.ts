import { z } from 'zod';
import { genMsgError, Required, Type } from '../helpers/genMsgError';

const userCreateSchema = {
  summary: 'Criar usuário',
  tags: ['Usuários'],
  body: z.object({
    name: z
      .string(genMsgError('name', Type.STRING, Required.TRUE)),
    email: z
      .string(genMsgError('email', Type.STRING, Required.TRUE)),
    picture: z
      .string(genMsgError('picture', Type.STRING, Required.NULL))
  })
    .describe(
      '<b>name:</b> string (mínimo 4 caracteres, máximo 64 caracteres)\n<b>email:</b> string\n<b>picture:</b> string',
    ),
  response: {
    201: z.object({
      userId: z
        .string(genMsgError('_id', Type.STRING, Required.TRUE)),
      name: z
        .string(genMsgError('name', Type.STRING, Required.TRUE)),
      email: z
        .string(genMsgError('email', Type.STRING, Required.TRUE)),
      picture: z
        .string(genMsgError('picture', Type.STRING, Required.NULL))
        .nullish(),
      createdAt: z
        .date(genMsgError('createdAt', Type.DATE, Required.TRUE))
    }),
  }
};

const userGetByEmailSchema = {
  summary: 'Buscar usuário pelo e-mail',
  tags: ['Usuários'],
  params: z.object({
    email: z
      .string(genMsgError('email', Type.STRING, Required.TRUE))
  })
    .describe(
      '<b>name:</b> string (mínimo 4 caracteres, máximo 64 caracteres)\n<b>email:</b> string\n<b>picture:</b> string',
    ),
  response: {
    201: z.object({
      userId: z
        .string(genMsgError('_id', Type.STRING, Required.TRUE)),
      name: z
        .string(genMsgError('name', Type.STRING, Required.TRUE)),
      email: z
        .string(genMsgError('email', Type.STRING, Required.TRUE)),
      picture: z
        .string(genMsgError('picture', Type.STRING, Required.NULL))
        .nullish(),
      createdAt: z
        .date(genMsgError('createdAt', Type.DATE, Required.TRUE))
    }),
  }
};

export {
  userCreateSchema,
  userGetByEmailSchema
};
