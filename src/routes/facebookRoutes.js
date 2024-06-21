import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import axios from 'axios';

import baseUrl from '../helpers/baseUrl.js';
import frontendBaseUrl from '../helpers/frontendBaseUrl.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  });

  return `${facebookAuthUrl}?${params.toString()}`;
};

router.get('/', (req, res) => {
  const url = buildFacebookAuthUrl();

  res.redirect(url);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    res.redirect(`${frontendBaseUrl}/login?error=missing_code`);
    return;
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

    const userInfoResponse = await axios.get(facebookUserInfoUrl, {
      params: {
        access_token: token,
        fields: 'id,name,email,picture'
      }
    });
    
    const user = userInfoResponse.data;

    req.session.user = user;
    req.session.token = token;

    res.redirect(`${frontendBaseUrl}/auth/facebook/callback?token=${token}`);
  } catch (error) {
    console.error('Erro durante a autenticação com Facebook:', error.response ? error.response.data : error);
    res.redirect(`${frontendBaseUrl}/login?error=auth_failed`);
  }
});

router.get('/user', async (req, res) => {
  try {
    const token = req.headers.facebook_token;

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

    const photoPath = path.join(__dirname, '..', '..', 'uploads', 'facebook', `${id}.jpg`);
    const writer = fs.createWriteStream(photoPath);

    photoResponse.data.pipe(writer);

    writer.on('finish', () => {
      const photoUrl = `${baseUrl}/uploads/facebook/${id}.jpg`;

      res.json({
        name,
        email,
        picture: photoUrl
      });
    });

    writer.on('error', (err) => {
      console.error('Error writing file:', err);
      res.status(500).json({ message: 'Error saving photo' });
    });
  } catch (error) {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;
