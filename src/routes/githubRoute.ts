import 'dotenv/config';
import axios from 'axios';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import apiBaseUrl from '../helpers/apiBaseUrl';
import webBaseUrl from '../helpers/webBaseUrl';
import { IUser } from '../interfaces/userInterface';
import createUserIfNotExists from '../helpers/createUserIfNotExists';
import { IGithubCallbackRequest, IGithubUserRequest } from '../interfaces/githubInterface';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
const githubRedirectUri = `${apiBaseUrl}/github/callback`;

const githubRoute = async (fastify: FastifyInstance) => {
  fastify.get('/github',
    {
      schema: { hide: true }
    },
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        reply.redirect(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${githubRedirectUri}&scope=user:email`);
      } catch (error) {
        return reply.redirect(`${webBaseUrl}/login?error=github`);
      }
    }
  );

  fastify.get('/github/callback',
    {
      schema: { hide: true }
    },
    async (
      request: FastifyRequest<{ Querystring: IGithubCallbackRequest }>,
      reply: FastifyReply
    ): Promise<void> => {
      try {
        const code = request.query.code;

        if (!code) {
          return reply.redirect(`${webBaseUrl}/login?error=github`);
        }

        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: githubRedirectUri
        }, {
          headers: {
            Accept: 'application/json'
          }
        });

        const accessToken = tokenResponse.data.access_token;

        reply.redirect(`${webBaseUrl}/auth/github/callback?token=${accessToken}`);
      } catch (error) {
        reply.redirect(`${webBaseUrl}/login?error=github`);
      }
    }
  );

  fastify.post('/github/user',
    {
      schema: { hide: true }
    },
    async (
      request: FastifyRequest<{ Headers: IGithubUserRequest }>,
      reply: FastifyReply
    ) => {
      try {
        const token = request.headers.github_token;

        if (!token) {
          return reply.redirect(`${webBaseUrl}/login?error=token`);
        }

        const userResponse = await axios.get('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const userInfo = userResponse.data;

        const user: IUser = {
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.avatar_url
        };

        await createUserIfNotExists(user);

        reply.status(200).send(user);
      } catch (error) {
        reply.redirect(`${webBaseUrl}/login?error=github`);
      }
    }
  );
};

export default githubRoute;
