Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _UserModel = /*#__PURE__*/ _interop_require_default(require("../models/UserModel"));
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
const userService = {
    createUser: function() {
        var _ref = _async_to_generator(function*(user) {
            try {
                const userCreated = yield _UserModel.default.create(user);
                return userCreated;
            } catch (error) {
                return {
                    error: 'Erro ao criar usuário'
                };
            }
        });
        return function(user) {
            return _ref.apply(this, arguments);
        };
    }(),
    getUserByEmail: function() {
        var _ref = _async_to_generator(function*(email) {
            try {
                const user = yield _UserModel.default.findOne({
                    email
                });
                return user;
            } catch (error) {
                return {
                    error: 'Erro ao buscar usuário por e-mail'
                };
            }
        });
        return function(email) {
            return _ref.apply(this, arguments);
        };
    }()
};
const _default = userService;
