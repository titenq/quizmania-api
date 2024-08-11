Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "logoutController", {
    enumerable: true,
    get: function() {
        return logoutController;
    }
});
const _nodeutil = require("node:util");
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
const { NAME_SESSION } = process.env;
const destroySession = function() {
    var _ref = _async_to_generator(function*(request) {
        const destroy = (0, _nodeutil.promisify)(request.session.destroy.bind(request.session));
        yield destroy();
    });
    return function destroySession(request) {
        return _ref.apply(this, arguments);
    };
}();
const logoutController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            yield destroySession(request);
            reply.clearCookie(NAME_SESSION);
            const messageSuccess = {
                message: 'Sucesso ao fazer logout'
            };
            reply.status(200).send(messageSuccess);
        } catch (error) {
            const errorMessage = {
                error: true,
                message: 'Erro ao fazer logout',
                statusCode: 400
            };
            (0, _errorHandler.default)(errorMessage, request, reply);
        }
    });
    return function logoutController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
