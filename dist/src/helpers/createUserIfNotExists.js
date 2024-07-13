Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _baseUrl = /*#__PURE__*/ _interop_require_default(require("./baseUrl"));
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
            const userExists = yield _axios.default.get(`${_baseUrl.default}/user/${user.email}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!userExists.data) {
                yield _axios.default.post(`${_baseUrl.default}/user`, user, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            throw error;
        }
    });
    return function createUserIfNotExists(user) {
        return _ref.apply(this, arguments);
    };
}();
const _default = createUserIfNotExists;
