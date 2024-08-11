Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _userService = /*#__PURE__*/ _interop_require_default(require("../services/userService"));
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
const createUserIfNotExists = function() {
    var _ref = _async_to_generator(function*(user) {
        try {
            const userExists = yield _userService.default.getUserByEmail(user === null || user === void 0 ? void 0 : user.email);
            if (!userExists) {
                const createUser = yield _userService.default.createUser(user);
                return createUser;
            }
            return userExists;
        } catch (error) {
            const errorMessage = {
                error: true,
                message: 'Erro ao criar usuário',
                statusCode: 400
            };
            throw errorMessage;
        }
    });
    return function createUserIfNotExists(user) {
        return _ref.apply(this, arguments);
    };
}();
const _default = createUserIfNotExists;
