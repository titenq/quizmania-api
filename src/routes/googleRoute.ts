import 'dotenv/config';
import axios from 'axios';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import { IUser } from '../interfaces/userInterface';
import apiBaseUrl from '../helpers/apiBaseUrl';
import webBaseUrl from '../helpers/webBaseUrl';
import createUserIfNotExists from '../helpers/createUserIfNotExists';
import { IGoogleCallbackRequest, IGoogleUserRequest } from '../interfaces/googleInterface';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const googleTokenUrl = 'https://oauth2.googleapis.com/token';
const googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
const googleRedirectUri = `${apiBaseUrl}/google/callback`;

const googleRoute = async (fastify: FastifyInstance) => {
  fastify.get('/google',
    {
      schema: { hide: true }
    },
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        reply.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${googleRedirectUri}&response_type=code&scope=openid%20profile%20email`);
      } catch (error) {
        return reply.redirect(`${webBaseUrl}/login?error=google`);
      }
    }
  );

  fastify.get('/google/callback',
    {
      schema: { hide: true }
    },
    async (
      request: FastifyRequest<{ Querystring: IGoogleCallbackRequest }>,
      reply: FastifyReply
    ): Promise<void> => {
      try {
        const code = request.query.code;

        if (!code) {
          return reply.redirect(`${webBaseUrl}/login?error=google`);
        }

        const tokenResponse = await axios.post(googleTokenUrl, new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID!,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: googleRedirectUri,
          grant_type: 'authorization_code'
        } as Record<string, string>), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        const token = tokenResponse.data.access_token;

        reply.redirect(`${webBaseUrl}/auth/google/callback?token=${token}`);
      } catch (error) {
        return reply.redirect(`${webBaseUrl}/login?error=google`);
      }
    }
  );

  fastify.post('/google/user',
    {
      schema: { hide: true }
    },
    async (
      request: FastifyRequest<{ Headers: IGoogleUserRequest }>,
      reply: FastifyReply
    ): Promise<IUser | void> => {
      try {
        const token = request.headers.google_token;

        if (!token) {
          return reply.redirect(`${webBaseUrl}/login?error=token`);
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
        return reply.redirect(`${webBaseUrl}/login?error=google`);
      }
    }
  );
};

export default googleRoute;
