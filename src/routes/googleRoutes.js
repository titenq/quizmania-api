import 'dotenv/config';
import express from 'express';
import axios from 'axios';

import baseUrl from '../helpers/baseUrl.js';
import frontendBaseUrl from '../helpers/frontendBaseUrl.js';

const router = express.Router();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const googleTokenUrl = 'https://oauth2.googleapis.com/token';
const googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
const googleRedirectUri = `${baseUrl}/google/callback`;

router.get('/', (req, res) => {
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=openid%20profile%20email`);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    res.redirect(`${frontendBaseUrl}/login?error=google`);

    return;
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

    const userInfoResponse = await axios.get(`${googleUserInfoUrl}?access_token=${token}`);
    const user = userInfoResponse.data;

    req.session.user = user;
    req.session.token = token;

    res.redirect(`${frontendBaseUrl}/auth/google/callback?token=${token}`);
  } catch (error) {
    console.error('Erro durante a autenticação com Google:', error);
    
    res.redirect(`${frontendBaseUrl}/login?error=auth_failed`);
  }
});

router.post('/user', (req, res) => {
  try {
    const obj = req.sessionStore.sessions;
    const key = Object.keys(obj)[0];
    const object = JSON.parse(obj[key]);

    const userInfo = {
      name: object.user.name,
      email: object.user.email,
      picture: object.user.picture
    };

    res.json(userInfo);
  } catch (error) {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;
