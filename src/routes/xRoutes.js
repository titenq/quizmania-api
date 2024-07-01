import crypto from 'node:crypto';

import 'dotenv/config';
import express from 'express';
import oauthSignature from 'oauth-signature';
import axios from 'axios';

const router = express.Router();

import baseUrl from '../helpers/baseUrl.js';
import frontendBaseUrl from '../helpers/frontendBaseUrl.js';

const xApiKey = process.env.X_API_KEY;
const xApiKeySecret = process.env.X_API_KEY_SECRET;
const xAccessToken = process.env.X_ACCESS_TOKEN;
const xAccessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET;
const xClientId = process.env.X_CLIENT_ID;

const xRedirectUri = `${baseUrl}/x/callback`;

router.get('/', async (req, res) => {
  res.redirect(`https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${xClientId}&redirect_uri=${xRedirectUri}&scope=tweet.read%20users.read%20follows.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`);
});

router.get('/callback', async (req, res) => {
  const createFormParams = (params) => {
    return Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  };

  const code = req.query.code;

  if (!code) {
    return res.redirect(`${frontendBaseUrl}/login?error=x`);
  }

  try {
    const base64Credentials = Buffer.from(`${xApiKey}:${xApiKeySecret}`, 'utf-8').toString('base64');

    const params = {
      code,
      grant_type: 'client_credentials',
      client_id: xClientId,
      redirect_uri: xRedirectUri
    };

    const response = await axios.post('https://api.twitter.com/oauth2/token',
      createFormParams(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization': `Basic ${base64Credentials}`
        }
      }
    );

    const { access_token } = response.data;

    res.redirect(`${frontendBaseUrl}/auth/x/callback?token=${access_token}`);
  } catch (error) {
    res.redirect(`${frontendBaseUrl}/login?error=x`);
  }
});

router.post('/user', async (req, res) => {
  const token = req.headers.x_token;
  
  const url = 'https://api.twitter.com/1.1/account/verify_credentials.json';
  const method = 'GET';

  const oauthNonce = crypto.randomBytes(16).toString('hex');
  const oauthTimestamp = Math.floor(Date.now() / 1000).toString();

  const params = {
    oauth_consumer_key: xApiKey,
    oauth_token: xAccessToken,
    oauth_nonce: oauthNonce,
    oauth_timestamp: oauthTimestamp,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    include_email: 'true'
  };

  const signature = oauthSignature.generate(method, url, params, xApiKeySecret, xAccessTokenSecret);

  params.oauth_signature = signature;

  const authHeader = `OAuth oauth_consumer_key="${params.oauth_consumer_key}", oauth_token="${params.oauth_token}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${params.oauth_timestamp}", oauth_nonce="${params.oauth_nonce}", oauth_version="1.0", oauth_signature="${params.oauth_signature}"`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      params: {
        include_email: 'true'
      }
    });

    const userInfo = response.data;

    const user = {
      name: userInfo.name,
      email: userInfo.id_str,
      picture: userInfo.profile_image_url_https,
    };

    res.status(200).json(user);
  } catch (error) {
    res.redirect(`${frontendBaseUrl}/login?error=x`);
  }
});

export default router;
