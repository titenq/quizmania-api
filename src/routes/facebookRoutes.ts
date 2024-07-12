import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express, { Request, Response } from 'express';
import axios from 'axios';

import baseUrl from '../helpers/baseUrl';
import frontendBaseUrl from '../helpers/frontendBaseUrl';
import { IUser } from '../interfaces/IUser';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const facebookAppId = process.env.FACEBOOK_APP_ID;
const facebookSecretKey = process.env.FACEBOOK_SECRET_KEY;
const facebookAuthUrl = 'https://www.facebook.com/v11.0/dialog/oauth';
const facebookTokenUrl = 'https://graph.facebook.com/v11.0/oauth/access_token';
const facebookUserInfoUrl = 'https://graph.facebook.com/me';
const facebookRedirectUri = `${baseUrl}/facebook/callback`;

const router = express.Router();

const buildFacebookAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: facebookAppId,
    redirect_uri: facebookRedirectUri,
    response_type: 'code',
    scope: 'email,public_profile'
  } as Record<string, string>);

  return `${facebookAuthUrl}?${params.toString()}`;
};

router.get('/', (req: Request, res: Response): void => {
  const url = buildFacebookAuthUrl();

  res.redirect(url);
});

router.get('/callback', async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code;

  if (!code) {
    return res.redirect(`${frontendBaseUrl}/login?error=facebook`);
  }

  try {
    const tokenResponse = await axios.get(facebookTokenUrl, {
      params: {
        client_id: facebookAppId,
        redirect_uri: facebookRedirectUri,
        client_secret: facebookSecretKey,
        code
      }
    });

    const token = tokenResponse.data.access_token;

    return res.redirect(`${frontendBaseUrl}/auth/facebook/callback?token=${token}`);
  } catch (error) {
    return res.redirect(`${frontendBaseUrl}/login?error=facebook`);
  }
});

router.post('/user', async (req: Request, res: Response): Promise<IUser | void> => {
  try {
    const token = req.headers.facebook_token;

    if (!token) {
      return res.redirect(`${frontendBaseUrl}/login?error=token`);
    }

    const response = await axios.get(`${facebookUserInfoUrl}?fields=id,name,email,picture.type(large)&access_token=${token}`);

    const id = response.data.id;
    const name = response.data.name;
    const email = response.data.email;
    const photo = response.data.picture.data.url;

    const photoResponse = await axios({
      url: photo,
      method: 'GET',
      responseType: 'stream'
    });

    const photoPath = path.join(dirname, '..', '..', '..', 'uploads', 'facebook', `${id}.jpg`);
    const writer = fs.createWriteStream(photoPath);

    photoResponse.data.pipe(writer);

    writer.on('finish', () => {
      const photoUrl = `${baseUrl}/uploads/facebook/${id}.jpg`;

      const user: IUser = {
        name,
        email,
        picture: photoUrl
      };

      res.status(200).json(user);
    });

    writer.on('error', error => {
      return res.redirect(`${frontendBaseUrl}/login?error=facebook`);
    });
  } catch (error) {
    return res.redirect(`${frontendBaseUrl}/login?error=facebook`);
  }
});

export default router;
