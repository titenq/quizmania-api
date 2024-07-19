Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" /* import express, { Request, Response } from 'express';

import { IUser } from '../interfaces/IUser';
import { IUserResponse } from '../interfaces/IUserResponse';
import User from '../models/UserModel';
import { IGenericError } from '../interfaces/IGenericError';
import apiKeyDecorator from '../decorators/apiKeyDecorator';

const router = express.Router();

router.post('/', async (req: Request<{}, {}, IUser>, res: Response<IUser | IGenericError>): Promise<Response<IUserResponse>> => {
  
});

router.get('/:email', async (req: Request, res: Response): Promise<Response<IUserResponse>> => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuário por e-mail' });
  }
});

export default router;
 */ , {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _errorHandler = /*#__PURE__*/ _interop_require_default(require("../helpers/errorHandler"));
const _userService = /*#__PURE__*/ _interop_require_default(require("../services/userService"));
const _userSchema = require("../schemas/userSchema");
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
const userRoute = function() {
    var _ref = _async_to_generator(function*(fastify) {
        fastify.withTypeProvider().post('/users', {
            schema: _userSchema.userCreateSchema
        }, function() {
            var _ref = _async_to_generator(function*(request, reply) {
                try {
                    const { name, email, picture } = request.body;
                    const { api_key } = request.headers;
                    const { apiKey } = process.env;
                    if (api_key !== apiKey) {
                        const error = {
                            error: 'api_key inválida'
                        };
                        reply.status(401).send(error);
                        return;
                    }
                    const userExists = yield _userService.default.getUserByEmail(email);
                    if (userExists) {
                        const error = {
                            error: 'E-mail já cadastrado'
                        };
                        return reply.status(409).send(error);
                    }
                    const user = yield _userService.default.createUser({
                        name,
                        email,
                        picture
                    });
                    return reply.status(200).send(user);
                } catch (error) {
                    (0, _errorHandler.default)(error, request, reply);
                }
            });
            return function(request, reply) {
                return _ref.apply(this, arguments);
            };
        }());
        fastify.withTypeProvider().get('/users/:email', {
            schema: _userSchema.userGetByEmailSchema
        }, function() {
            var _ref = _async_to_generator(function*(request, reply) {
                try {
                    const { email } = request.params;
                    const user = yield _userService.default.getUserByEmail(email);
                    if (!user) {
                        return reply.status(404).send({
                            error: 'Erro ao buscar usuário por e-mail'
                        });
                    }
                    return reply.status(200).send(user);
                } catch (error) {
                    (0, _errorHandler.default)(error, request, reply);
                }
            });
            return function(request, reply) {
                return _ref.apply(this, arguments);
            };
        }());
    });
    return function userRoute(fastify) {
        return _ref.apply(this, arguments);
    };
}();
const _default = userRoute;
