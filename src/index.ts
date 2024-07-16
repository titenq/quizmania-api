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
import baseUrl from './helpers/baseUrl';
import siteOrigin from './helpers/siteOrigin';
import pingEndpoint from './helpers/pingEndpoint';
import errorHandler from './helpers/errorHandler';
import { fastifySwaggerOptions, fastifySwaggerUiOptions } from './helpers/swaggerOptions';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const { PORT, SECRET, NAME_SESSION, NODE_ENV } = process.env;

const app = fastify();

app.register(fastifyHelmet/* , {
  contentSecurityPolicy: false,
  frameguard: false
} */);

app.register(fastifyCors, {
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
});

app.register(fastifyCookie);

app.register(fastifySession, {
  secret: SECRET!/* ,
  cookie: {
    secure: NODE_ENV === 'PROD',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 dia
  },
  saveUninitialized: false,
  resave: false,
  name: NAME_SESSION
 */});

app.addHook('preHandler', (request, reply, next) => {
  request.session.cookie.httpOnly = true;
  request.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 1 dia
  request.session.cookie.secure = NODE_ENV === 'PROD';

  next();
})

app.register(fastifyStatic, {
  root: path.join(dirname, '..', '..', 'uploads', 'facebook'),
  prefix: '/uploads/facebook/',
});

app.register(fastifySwagger, fastifySwaggerOptions);
app.register(fastifySwaggerUi, fastifySwaggerUiOptions);

/* app.register(googleRoutes, { prefix: '/google' });
app.register(facebookRoutes, { prefix: '/facebook' });
app.register(xRoutes, { prefix: '/x' });
app.register(githubRoutes, { prefix: '/github' });
app.register(logoutRoutes, { prefix: '/logout' });
app.register(pingRoutes, { prefix: '/ping' });
app.register(userRoutes, { prefix: '/user' }); */

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(errorHandler);

// app.register(pingRoutes, { prefix: '/ping' });

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

  console.log(`Server started in ${baseUrl}`);
  console.log(`API Doc: ${baseUrl}/docs`);
} catch (err) {
  app.log.error(err);

  process.exit(1);
}
