import 'dotenv/config';
import { FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';

import apiBaseUrl from '../helpers/apiBaseUrl';
import webBaseUrl from '../helpers/webBaseUrl';
import { IUser } from '../interfaces/userInterface';
import createUserIfNotExists from '../helpers/createUserIfNotExists';
import { IXCallbackRequest, IXUserRequest } from '../interfaces/xInterface';

const { X_API_KEY, X_API_KEY_SECRET, X_CLIENT_ID } = process.env;
const xRedirectUri = `${apiBaseUrl}/x/callback`;

export const xAuthController = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    reply.redirect(`https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${X_CLIENT_ID}&redirect_uri=${xRedirectUri}&scope=tweet.read%20users.read%20follows.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`);
  } catch (error) {
    reply.redirect(`${webBaseUrl}/login?error=x`);
  }
};

export const xCallbackController = async (
  request: FastifyRequest<{ Querystring: IXCallbackRequest }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const code = request.query.code;

    if (!code) {
      reply.redirect(`${webBaseUrl}/login?error=x`);

      return;
    }

    const base64Credentials = Buffer.from(`${X_API_KEY}:${X_API_KEY_SECRET}`, 'utf-8').toString('base64');

    const params = new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: X_CLIENT_ID,
      redirect_uri: xRedirectUri,
      code_verifier: 'challenge'
    } as Record<string, string>);

    const response = await axios.post('https://api.twitter.com/2/oauth2/token', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': `Basic ${base64Credentials}`
      }
    });

    const { access_token } = response.data;

    reply.redirect(`${webBaseUrl}/auth/x/callback?token=${access_token}`);
  } catch (error) {
    reply.redirect(`${webBaseUrl}/login?error=x`);
  }
};

export const xUserController = async (
  request: FastifyRequest<{ Headers: IXUserRequest }>,
  reply: FastifyReply
): Promise<IUser | void> => {
  try {
    const token = request.headers.x_token;

    if (!token) {
      reply.redirect(`${webBaseUrl}/login?error=token`);
      
      return;
    }

    const response = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        'user.fields': 'name,id,profile_image_url',
      }
    });

    const userInfo = response.data;

    const user: IUser = {
      name: userInfo.data.name,
      email: userInfo.data.id,
      picture: userInfo.data.profile_image_url
    };

    await createUserIfNotExists(user);

    reply.status(200).send(user);
  } catch (error) {
    reply.redirect(`${webBaseUrl}/login?error=x`);
  }
};
