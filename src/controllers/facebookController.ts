import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';

import { FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';

import apiBaseUrl from '../helpers/apiBaseUrl';
import webBaseUrl from '../helpers/webBaseUrl';
import { IUser } from '../interfaces/userInterface';
import createUserIfNotExists from '../helpers/createUserIfNotExists';
import { IFacebookCallbackRequest, IFacebookUserRequest } from '../interfaces/facebookInterface';

const { FACEBOOK_APP_ID, FACEBOOK_SECRET_KEY } = process.env;

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const facebookAuthUrl = 'https://www.facebook.com/v11.0/dialog/oauth';
const facebookTokenUrl = 'https://graph.facebook.com/v11.0/oauth/access_token';
const facebookUserInfoUrl = 'https://graph.facebook.com/me';
const facebookRedirectUri = `${apiBaseUrl}/facebook/callback`;

const buildFacebookAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: FACEBOOK_APP_ID,
    redirect_uri: facebookRedirectUri,
    response_type: 'code',
    scope: 'email,public_profile'
  } as Record<string, string>);

  return `${facebookAuthUrl}?${params.toString()}`;
};

const asyncPipeline = promisify(pipeline);

export const facebookAuthController = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const url = buildFacebookAuthUrl();

    reply.redirect(url);
  } catch (error) {
    reply.redirect(`${webBaseUrl}/login?error=facebook`);
  }
};

export const facebookCallbackController = async (
  request: FastifyRequest<{ Querystring: IFacebookCallbackRequest }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const code = request.query.code;

    if (!code) {
      reply.redirect(`${webBaseUrl}/login?error=facebook`);

      return;
    }

    const tokenResponse = await axios.get(facebookTokenUrl, {
      params: {
        client_id: FACEBOOK_APP_ID,
        redirect_uri: facebookRedirectUri,
        client_secret: FACEBOOK_SECRET_KEY,
        code
      }
    });

    const token = tokenResponse.data.access_token;
    
    reply.redirect(`${webBaseUrl}/auth/facebook/callback?token=${token}`);
  } catch (error) {
    reply.redirect(`${webBaseUrl}/login?error=facebook`);
  }
};

export const facebookUserController = async (
  request: FastifyRequest<{ Headers: IFacebookUserRequest }>,
  reply: FastifyReply
) => {
  try {
    const token = request.headers.facebook_token;

    if (!token) {
      reply.redirect(`${webBaseUrl}/login?error=token`);

      return;
    }

    const response = await axios.get(`${facebookUserInfoUrl}?fields=id,name,email,picture.type(large)&access_token=${token}`);
    const { id, name, email, picture } = response.data;
    
    const photoUrl = `${apiBaseUrl}/uploads/facebook/${id}.jpg`;
    const photoPath = path.join(dirname, '..', '..', '..', 'uploads', 'facebook', `${id}.jpg`);

    const photoResponse = await axios({
      url: picture.data.url,
      method: 'GET',
      responseType: 'stream'
    });

    await asyncPipeline(photoResponse.data, fs.createWriteStream(photoPath));

    const user: IUser = {
      name,
      email,
      picture: photoUrl
    };

    const userExists = await createUserIfNotExists(user);

    reply.status(200).send(userExists);
  } catch (error) {
    reply.redirect(`${webBaseUrl}/login?error=facebook`);
  }
};
