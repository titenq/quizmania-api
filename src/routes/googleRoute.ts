import 'dotenv/config';
import axios from 'axios';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import errorHandler from '../helpers/errorHandler';
import userService from '../services/userService';
import { userCreateSchema } from '../schemas/userSchema';
import { IUser } from '../interfaces/IUser';
import baseUrl from '../helpers/baseUrl';
import frontendBaseUrl from '../helpers/frontendBaseUrl';
import createUserIfNotExists from '../helpers/createUserIfNotExists';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const googleTokenUrl = 'https://oauth2.googleapis.com/token';
const googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
const googleRedirectUri = `${baseUrl}/google/callback`;

const googleRoute = async (fastify: FastifyInstance, options: any) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/google',
    async (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => {
      try {
        reply.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${googleRedirectUri}&response_type=code&scope=openid%20profile%20email`);
      } catch (error) {
        errorHandler(error, request, reply);
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/google/callback',
    async (
      request: FastifyRequest<{ Querystring: { code: string } }>,
      reply: FastifyReply,
    ) => {
      try {
        const code = request.query.code;

        if (!code) {
          return reply.redirect(`${frontendBaseUrl}/login?error=google`);
        }

        const tokenResponse = await axios.post(googleTokenUrl, new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: googleRedirectUri,
          grant_type: 'authorization_code'
        } as Record<string, string>),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        const token = tokenResponse.data.access_token;

        reply.redirect(`${frontendBaseUrl}/auth/google/callback?token=${token}`);
      } catch (error) {
        reply.redirect(`${frontendBaseUrl}/login?error=google`);
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/google/user',
    async (
      request: FastifyRequest<{ Headers: { google_token: string } }>,
      reply: FastifyReply,
    ) => {
      try {
        const token = request.headers.google_token;

        if (!token) {
          return reply.redirect(`${frontendBaseUrl}/login?error=token`);
        }

        const userInfoResponse = await axios.get(`${googleUserInfoUrl}?access_token=${token}`);
        const userInfo = await userInfoResponse.data;

        const user: IUser = {
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture
        };

        await createUserIfNotExists(user);

        reply.status(200).send(user);
      } catch (error) {
        reply.redirect(`${frontendBaseUrl}/login?error=google`);
      }
    },
  );
};

export default googleRoute;

/* import 'dotenv/config';
import express, { Request, Response } from 'express';
import axios from 'axios';

import baseUrl from '../helpers/baseUrl';
import frontendBaseUrl from '../helpers/frontendBaseUrl';
import { IUser } from '../interfaces/IUser';
import createUserIfNotExists from '../helpers/createUserIfNotExists';

const router = express.Router();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const googleTokenUrl = 'https://oauth2.googleapis.com/token';
const googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
const googleRedirectUri = `${baseUrl}/google/callback`;

router.get('/', (req: Request, res: Response): void => {
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=openid%20profile%20email`);
});

router.get('/callback', async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code;

  if (!code) {
    return res.redirect(`${frontendBaseUrl}/login?error=google`);
  }

  try {
    const tokenResponse = await axios.post(googleTokenUrl, new URLSearchParams({
      code,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: googleRedirectUri,
      grant_type: 'authorization_code'
    } as Record<string, string>),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const token = tokenResponse.data.access_token;

    res.redirect(`${frontendBaseUrl}/auth/google/callback?token=${token}`);
  } catch (error) {
    res.redirect(`${frontendBaseUrl}/login?error=google`);
  }
});

router.post('/user', async (req, res): Promise<IUser | void> => {
  try {
    const token = req.headers.google_token;

    if (!token) {
      return res.redirect(`${frontendBaseUrl}/login?error=token`);
    }

    const userInfoResponse = await axios.get(`${googleUserInfoUrl}?access_token=${token}`);
    const userInfo = await userInfoResponse.data;

    const user: IUser = {
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture
    };

    await createUserIfNotExists(user);

    res.status(200).json(user);
  } catch (error) {
    res.redirect(`${frontendBaseUrl}/login?error=google`);
  }
});

export default router;
 */