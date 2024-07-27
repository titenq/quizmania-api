import { FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';

import { IUser } from '../interfaces/userInterface';
import { IGoogleCallbackRequest, IGoogleUserRequest } from '../interfaces/googleInterface';
import createUserIfNotExists from '../helpers/createUserIfNotExists';
import webBaseUrl from '../helpers/webBaseUrl';
import apiBaseUrl from '../helpers/apiBaseUrl';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const googleTokenUrl = 'https://oauth2.googleapis.com/token';
const googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
const googleRedirectUri = `${apiBaseUrl}/google/callback`;

export const googleAuthController = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    reply.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${googleRedirectUri}&response_type=code&scope=openid%20profile%20email`);
  } catch (error) {
    reply.redirect(`${webBaseUrl}/login?error=google`);
  }
};

export const googleCallbackController = async (
  request: FastifyRequest<{ Querystring: IGoogleCallbackRequest }>,
  reply: FastifyReply
) => {
  try {
    const code = request.query.code;

    if (!code) {
      reply.redirect(`${webBaseUrl}/login?error=google`);

      return;
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
    reply.redirect(`${webBaseUrl}/login?error=google`);
  }
};

export const googleUserController = async (
  request: FastifyRequest<{ Headers: IGoogleUserRequest }>,
  reply: FastifyReply
): Promise<IUser | void> => {
  try {
    const token = request.headers.google_token;

    if (!token) {
      reply.redirect(`${webBaseUrl}/login?error=token`);

      return;
    }

    const userInfoResponse = await axios.get(`${googleUserInfoUrl}?access_token=${token}`);
    const userInfo = await userInfoResponse.data;

    const user: IUser = {
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture
    };

    const userExists = await createUserIfNotExists(user);

    reply.status(200).send(userExists);
  } catch (error) {
    reply.redirect(`${webBaseUrl}/login?error=google`);
  }
};
