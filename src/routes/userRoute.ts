import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import errorHandler from '../helpers/errorHandler';
import userService from '../services/userService';
import { userCreateSchema, userGetByEmailSchema } from '../schemas/userSchema';
import { IUser } from '../interfaces/IUser';

const userRoute = async (fastify: FastifyInstance, options: any) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/users',
    { schema: userCreateSchema },
    async (
      request: FastifyRequest<{ Body: IUser }>,
      reply: FastifyReply
    ) => {
      try {
        const { name, email, picture } = request.body;

        const userExists = await userService.getUserByEmail(email);

        if (userExists) {
          return reply.status(409).send({
            error: 'E-mail já cadastrado',
          });
        }

        const user = await userService.createUser({
          name,
          email,
          picture
        });

        return reply.status(200).send(user);
      } catch (error) {
        errorHandler(error, request, reply);
      }
    }
  );
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/users/:email',
      { schema: userGetByEmailSchema },
      async (
        request: FastifyRequest<{ Params: { email: string } }>,
        reply: FastifyReply
      ) => {
        try {
          const { email } = request.params;

          const user = await userService.getUserByEmail(email);

          if (!user) {
            return reply.status(404).send({
              error: 'Erro ao buscar usuário por e-mail'
            });
          }

          return reply.status(200).send(user);
        } catch (error) {
          errorHandler(error, request, reply);
        }
      }
    );
};

export default userRoute;

/* import express, { Request, Response } from 'express';

import { IUser } from '../interfaces/IUser';
import { IUserResponse } from '../interfaces/IUserResponse';
import User from '../models/UserModel';
import { IGenericError } from '../interfaces/IGenericError';

const router = express.Router();

router.post('/', async (req: Request<{}, {}, IUser>, res: Response<IUser | IGenericError>): Promise<Response<IUserResponse>> => {
  
});

router.get('/:email', async (req: Request, res: Response): Promise<Response<IUserResponse>> => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuário por e-mail' });
  }
});

export default router;
 */