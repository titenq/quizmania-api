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
    githubAuthController: function() {
        return githubAuthController;
    },
    githubCallbackController: function() {
        return githubCallbackController;
    },
    githubUserController: function() {
        return githubUserController;
    }
});
require("dotenv/config");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _apiBaseUrl = /*#__PURE__*/ _interop_require_default(require("../helpers/apiBaseUrl"));
const _webBaseUrl = /*#__PURE__*/ _interop_require_default(require("../helpers/webBaseUrl"));
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
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
const githubRedirectUri = `${_apiBaseUrl.default}/github/callback`;
const githubAuthController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            reply.redirect(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${githubRedirectUri}&scope=user:email`);
        } catch (error) {
            reply.redirect(`${_webBaseUrl.default}/login?error=github`);
        }
    });
    return function githubAuthController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const githubCallbackController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const code = request.query.code;
            if (!code) {
                reply.redirect(`${_webBaseUrl.default}/login?error=github`);
                return;
            }
            const tokenResponse = yield _axios.default.post('https://github.com/login/oauth/access_token', {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: githubRedirectUri
            }, {
                headers: {
                    Accept: 'application/json'
                }
            });
            const accessToken = tokenResponse.data.access_token;
            reply.redirect(`${_webBaseUrl.default}/auth/github/callback?token=${accessToken}`);
        } catch (error) {
            reply.redirect(`${_webBaseUrl.default}/login?error=github`);
        }
    });
    return function githubCallbackController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const githubUserController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const token = request.headers.github_token;
            if (!token) {
                reply.redirect(`${_webBaseUrl.default}/login?error=token`);
                return;
            }
            const userResponse = yield _axios.default.get('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const userInfo = userResponse.data;
            const user = {
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.avatar_url
            };
            yield (0, _createUserIfNotExists.default)(user);
            reply.status(200).send(user);
        } catch (error) {
            reply.redirect(`${_webBaseUrl.default}/login?error=github`);
        }
    });
    return function githubUserController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
