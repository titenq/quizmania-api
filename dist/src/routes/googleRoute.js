Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" /* import 'dotenv/config';
import express, { Request, Response } from 'express';
import axios from 'axios';

import baseUrl from '../helpers/baseUrl';
import frontendBaseUrl from '../helpers/frontendBaseUrl';
import { IUser } from '../interfaces/IUser';
import createUserIfNotExists from '../helpers/createUserIfNotExists';

const router = express.Router();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const googleTokenUrl = 'https://oauth2.googleapis.com/token';
const googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
const googleRedirectUri = `${baseUrl}/google/callback`;

router.get('/', (req: Request, res: Response): void => {
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=openid%20profile%20email`);
});

router.get('/callback', async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code;

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
    } as Record<string, string>),
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

router.post('/user', async (req, res): Promise<IUser | void> => {
  try {
    const token = req.headers.google_token;

    if (!token) {
      return res.redirect(`${frontendBaseUrl}/login?error=token`);
    }

    const userInfoResponse = await axios.get(`${googleUserInfoUrl}?access_token=${token}`);
    const userInfo = await userInfoResponse.data;

    const user: IUser = {
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture
    };

    await createUserIfNotExists(user);

    res.status(200).json(user);
  } catch (error) {
    res.redirect(`${frontendBaseUrl}/login?error=google`);
  }
});

export default router;
 */ , {
    enumerable: true,
    get: function() {
        return _default;
    }
});
require("dotenv/config");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _errorHandler = /*#__PURE__*/ _interop_require_default(require("../helpers/errorHandler"));
const _baseUrl = /*#__PURE__*/ _interop_require_default(require("../helpers/baseUrl"));
const _frontendBaseUrl = /*#__PURE__*/ _interop_require_default(require("../helpers/frontendBaseUrl"));
const _createUserIfNotExists = /*#__PURE__*/ _interop_require_default(require("../helpers/createUserIfNotExists"));
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const googleTokenUrl = 'https://oauth2.googleapis.com/token';
const googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
const googleRedirectUri = `${_baseUrl.default}/google/callback`;
const googleRoute = function() {
    var _ref = _async_to_generator(function*(fastify, options) {
        fastify.withTypeProvider().get('/google', function() {
            var _ref = _async_to_generator(function*(request, reply) {
                try {
                    reply.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${googleRedirectUri}&response_type=code&scope=openid%20profile%20email`);
                } catch (error) {
                    (0, _errorHandler.default)(error, request, reply);
                }
            });
            return function(request, reply) {
                return _ref.apply(this, arguments);
            };
        }());
        fastify.withTypeProvider().get('/google/callback', function() {
            var _ref = _async_to_generator(function*(request, reply) {
                try {
                    const code = request.query.code;
                    if (!code) {
                        return reply.redirect(`${_frontendBaseUrl.default}/login?error=google`);
                    }
                    const tokenResponse = yield _axios.default.post(googleTokenUrl, new URLSearchParams({
                        code,
                        client_id: GOOGLE_CLIENT_ID,
                        client_secret: GOOGLE_CLIENT_SECRET,
                        redirect_uri: googleRedirectUri,
                        grant_type: 'authorization_code'
                    }), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });
                    const token = tokenResponse.data.access_token;
                    reply.redirect(`${_frontendBaseUrl.default}/auth/google/callback?token=${token}`);
                } catch (error) {
                    reply.redirect(`${_frontendBaseUrl.default}/login?error=google`);
                }
            });
            return function(request, reply) {
                return _ref.apply(this, arguments);
            };
        }());
        fastify.withTypeProvider().post('/google/user', function() {
            var _ref = _async_to_generator(function*(request, reply) {
                try {
                    const token = request.headers.google_token;
                    if (!token) {
                        return reply.redirect(`${_frontendBaseUrl.default}/login?error=token`);
                    }
                    const userInfoResponse = yield _axios.default.get(`${googleUserInfoUrl}?access_token=${token}`);
                    const userInfo = yield userInfoResponse.data;
                    const user = {
                        name: userInfo.name,
                        email: userInfo.email,
                        picture: userInfo.picture
                    };
                    yield (0, _createUserIfNotExists.default)(user);
                    reply.status(200).send(user);
                } catch (error) {
                    reply.redirect(`${_frontendBaseUrl.default}/login?error=google`);
                }
            });
            return function(request, reply) {
                return _ref.apply(this, arguments);
            };
        }());
    });
    return function googleRoute(fastify, options) {
        return _ref.apply(this, arguments);
    };
}();
const _default = googleRoute;
