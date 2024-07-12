import 'dotenv/config';
import express, { Request, Response, Router } from 'express';
import axios, { AxiosResponse } from 'axios';

import baseUrl from '../helpers/baseUrl';
import frontendBaseUrl from '../helpers/frontendBaseUrl';
import { IUser } from '../interfaces/IUser';

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

    res.status(200).json(user);
  } catch (error) {
    res.redirect(`${frontendBaseUrl}/login?error=google`);
  }
});

export default router;
