Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createUserController: function() {
        return createUserController;
    },
    getUserByEmailController: function() {
        return getUserByEmailController;
    }
});
const _userService = /*#__PURE__*/ _interop_require_default(require("../services/userService"));
const _errorHandler = /*#__PURE__*/ _interop_require_default(require("../helpers/errorHandler"));
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
const createUserController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const { name, email, picture } = request.body;
            const { api_key } = request.headers;
            const { API_KEY } = process.env;
            if (api_key !== API_KEY) {
                const errorMessage = {
                    error: true,
                    message: 'api_key inválida',
                    statusCode: 401
                };
                (0, _errorHandler.default)(errorMessage, request, reply);
                return;
            }
            const userExists = yield _userService.default.getUserByEmail(email);
            if (userExists) {
                const errorMessage = {
                    error: true,
                    message: 'E-mail já cadastrado',
                    statusCode: 409
                };
                (0, _errorHandler.default)(errorMessage, request, reply);
                return;
            }
            const user = yield _userService.default.createUser({
                name,
                email,
                picture
            });
            reply.status(200).send(user);
        } catch (error) {
            const errorMessage = {
                error: true,
                message: 'Erro ao criar usuário',
                statusCode: 500
            };
            (0, _errorHandler.default)(errorMessage, request, reply);
        }
    });
    return function createUserController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const getUserByEmailController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const { email } = request.params;
            const user = yield _userService.default.getUserByEmail(email);
            if (!user) {
                const errorMessage = {
                    error: true,
                    message: 'Erro ao buscar usuário por e-mail',
                    statusCode: 404
                };
                (0, _errorHandler.default)(errorMessage, request, reply);
                return;
            }
            reply.status(200).send(user);
        } catch (error) {
            const errorMessage = {
                error: true,
                message: 'Erro ao buscar usuário por e-mail',
                statusCode: 500
            };
            (0, _errorHandler.default)(errorMessage, request, reply);
        }
    });
    return function getUserByEmailController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
