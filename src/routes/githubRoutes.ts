import 'dotenv/config';
import express, { Request, Response } from 'express';
import axios from 'axios';

import baseUrl from '../helpers/baseUrl';
import frontendBaseUrl from '../helpers/frontendBaseUrl';
import { IUser } from '../interfaces/IUser';
import createUserIfNotExists from '../helpers/createUserIfNotExists';

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const githubRedirectUri = `${baseUrl}/github/callback`;

const router = express.Router();

router.get('/', (req: Request, res: Response): void => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${githubRedirectUri}&scope=user:email`);
});

router.get('/callback', async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.redirect(`${frontendBaseUrl}/login?error=github`);
    }

    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: githubClientId,
      client_secret: githubClientSecret,
      code,
      redirect_uri: githubRedirectUri
    }, {
      headers: {
        Accept: 'application/json'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    res.redirect(`${frontendBaseUrl}/auth/github/callback?token=${accessToken}`);
  } catch (error) {
    res.redirect(`${frontendBaseUrl}/login?error=github`);
  }
});

router.post('/user', async(req: Request, res: Response): Promise<IUser | void> => {
  try {
    const token = req.headers.github_token;

    if (!token) {
      return res.redirect(`${frontendBaseUrl}/login?error=token`);
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

    res.status(200).json(user);
  } catch (error) {
    res.redirect(`${frontendBaseUrl}/login?error=github`);
  }
});

export default router;
