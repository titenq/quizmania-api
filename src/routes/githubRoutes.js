import 'dotenv/config';
import express from 'express';
import axios from 'axios';

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const redirectUri = 'http://localhost:4000/github/callback';

const router = express.Router();

router.get('/', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=user:email`;

  res.redirect(githubAuthUrl);
});

router.get('/callback', async (req, res) => {
  try {
    const code = req.query.code;

    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: githubClientId,
      client_secret: githubClientSecret,
      code,
      redirect_uri: redirectUri
    }, {
      headers: {
        Accept: 'application/json'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    res.redirect(`http://localhost:5173/auth/github/callback?token=${accessToken}`);
  } catch (error) {
    console.error('Error during GitHub OAuth process:', error);

    res.status(500).json({ message: 'Authentication failed' });
  }
});

router.get('/user', async(req, res) => {
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
