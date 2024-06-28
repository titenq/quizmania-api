import 'dotenv/config';
import express from 'express';
import axios from 'axios';

import baseUrl from '../helpers/baseUrl.js';
import frontendBaseUrl from '../helpers/frontendBaseUrl.js';

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const githubRedirectUri = `${baseUrl}/github/callback`;

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${githubRedirectUri}&scope=user:email`);
});

router.get('/callback', async (req, res) => {
  try {
    const code = req.query.code;

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
    console.error('Error during GitHub OAuth process:', error);

    res.status(500).json({ message: 'Authentication failed' });
  }
});

router.post('/user', async(req, res) => {
  try {
    const token = req.headers.github_token;

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const userInfo = userResponse.data;

    const user = {
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.avatar_url
    };

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;
