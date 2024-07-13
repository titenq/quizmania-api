import path from 'node:path';
import { fileURLToPath } from 'node:url';

import 'dotenv/config';
import express, { Application } from 'express';
import axios, { AxiosResponse } from 'axios';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';

import baseUrl from './helpers/baseUrl';
import siteOrigin from './helpers/siteOrigin';
import googleRoutes from './routes/googleRoutes';
import facebookRoutes from './routes/facebookRoutes';
import xRoutes from './routes/xRoutes';
import githubRoutes from './routes/githubRoutes';
import logoutRoutes from './routes/logoutRoutes';
import pingRoutes from './routes/pingRoutes';
import userRoutes from './routes/userRoutes';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const { PORT, SECRET, NAME_SESSION, NODE_ENV } = process.env;

const app: Application = express();

app.use(express.json());

app.use(helmet({
  contentSecurityPolicy: false,
  frameguard: false
}));

app.use(session({
  name: NAME_SESSION,
  secret: SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: NODE_ENV === 'PROD',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 dia
  }
}));

app.use(cors({
  origin: siteOrigin,
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Origin',
    'facebook_token',
    'github_token',
    'google_token',
    'x_token'
  ]
}));

app.use('/uploads/facebook',
  express.static(path.join(dirname, '..', '..', 'uploads', 'facebook')));

app.use('/google', googleRoutes);
app.use('/facebook', facebookRoutes);
app.use('/x', xRoutes);
app.use('/github', githubRoutes);
app.use('/logout', logoutRoutes);
app.use('/ping', pingRoutes);
app.use('/user', userRoutes);

const pingEndpoint = () => {
  setInterval(async () => {
    try {
      const response: AxiosResponse<string, string> = await axios.get(`${baseUrl}/ping`);
      
      console.log('Ping response:', response.data);
    } catch (err) {
      console.error('Erro ao fazer ping:', err);
    }
  }, 840000); // 14 minutos
};

app.listen(PORT , () => {
  console.log(`Server running on ${baseUrl}`);

  pingEndpoint();
});
