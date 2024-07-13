import 'dotenv/config';
import express, { Request, Response } from 'express';
import axios from 'axios';

import baseUrl from '../helpers/baseUrl';
import frontendBaseUrl from '../helpers/frontendBaseUrl';
import { IUser } from '../interfaces/IUser';
import createUserIfNotExists from '../helpers/createUserIfNotExists';

const router = express.Router();

const xApiKey = process.env.X_API_KEY;
const xApiKeySecret = process.env.X_API_KEY_SECRET;
const xClientId = process.env.X_CLIENT_ID;

const xRedirectUri = `${baseUrl}/x/callback`;

router.get('/', (req: Request, res: Response): void => {
  res.redirect(`https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${xClientId}&redirect_uri=${xRedirectUri}&scope=tweet.read%20users.read%20follows.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`);
});

router.get('/callback', async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code;

  if (!code) {
    return res.redirect(`${frontendBaseUrl}/login?error=x`);
  }

  try {
    const base64Credentials = Buffer.from(`${xApiKey}:${xApiKeySecret}`, 'utf-8').toString('base64');

    const params = new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: xClientId,
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

    res.redirect(`${frontendBaseUrl}/auth/x/callback?token=${access_token}`);
  } catch (error) {
    res.redirect(`${frontendBaseUrl}/login?error=x`);
  }
});

router.post('/user', async (req: Request, res: Response): Promise<IUser | void> => {
  const token = req.headers.x_token;

  if (!token) {
    return res.redirect(`${frontendBaseUrl}/login?error=token`);
  }

  try {
    const response = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        'user.fields': 'name,id,profile_image_url',
      }
    });

    const userInfo = response.data;

    console.log(userInfo);

    const user: IUser = {
      name: userInfo.data.name,
      email: userInfo.data.id,
      picture: userInfo.data.profile_image_url
    };

    await createUserIfNotExists(user);

    res.status(200).json(user);
  } catch (error) {
    res.redirect(`${frontendBaseUrl}/login?error=x`);
  }
});

export default router;
