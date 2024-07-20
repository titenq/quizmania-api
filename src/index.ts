import path from 'node:path';
import { fileURLToPath } from 'node:url';

import 'dotenv/config';
import fastify from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyStatic from '@fastify/static';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import indexRoute from './routes/indexRoute';
import apiBaseUrl from './helpers/apiBaseUrl';
import siteOrigin from './helpers/siteOrigin';
import pingEndpoint from './helpers/pingEndpoint';
import errorHandler from './helpers/errorHandler';
import { fastifySwaggerOptions, fastifySwaggerUiOptions } from './helpers/swaggerOptions';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const { PORT, SECRET, NAME_SESSION, NODE_ENV } = process.env;

const app = fastify();

app.register(fastifyHelmet);

app.register(fastifyCors, {
  origin: siteOrigin /* ['http://localhost:5173, http://127.0.0.1:5173'] */,
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Origin',
    'api_key',
    'facebook_token',
    'github_token',
    'google_token',
    'x_token'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
});

app.register(fastifyCookie);

app.register(fastifySession, {
  secret: SECRET!,
  cookieName: NAME_SESSION,
  cookie: {
    secure: NODE_ENV === 'PROD',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 dia
  }
});

app.register(fastifyStatic, {
  root: path.join(dirname, '..', '..', 'uploads', 'facebook'),
  prefix: '/uploads/facebook/',
});

app.register(fastifySwagger, fastifySwaggerOptions);
app.register(fastifySwaggerUi, fastifySwaggerUiOptions);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(errorHandler);

const startServer = async () => {
  await indexRoute(app);

  await app.listen({
    port: Number(PORT),
    host: '0.0.0.0'
  });

  pingEndpoint();
};

try {
  startServer();

  console.log(`Server started in ${apiBaseUrl}`);
  console.log(`API Doc: ${apiBaseUrl}/docs`);
} catch (error) {
  console.error(error);
}
