import 'dotenv/config';
import express from 'express';
import axios from 'axios';

import baseUrl from '../helpers/baseUrl';
import frontendBaseUrl from '../helpers/frontendBaseUrl';

const router = express.Router();

const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;

const googleTokenUrl = 'https://oauth2.googleapis.com/token';
const googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
const googleRedirectUri = `${baseUrl}/google/callback`;

router.get('/', (req, res) => {
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=openid%20profile%20email`);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code as string;

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
    }),
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

router.post('/user', async (req, res) => {
  try {
    const token = req.headers.google_token;

    if (!token) {
      return res.redirect(`${frontendBaseUrl}/login?error=token`);
    }

    const userInfoResponse = await axios.get(`${googleUserInfoUrl}?access_token=${token}`);
    const user = await userInfoResponse.data;

    const userInfo = {
      name: user.name,
      email: user.email,
      picture: user.picture
    };

    res.status(200).json(userInfo);
  } catch (error) {
    res.redirect(`${frontendBaseUrl}/login?error=google`);
  }
});

export default router;
