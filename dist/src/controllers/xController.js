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
    xAuthController: function() {
        return xAuthController;
    },
    xCallbackController: function() {
        return xCallbackController;
    },
    xUserController: function() {
        return xUserController;
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
const { X_API_KEY, X_API_KEY_SECRET, X_CLIENT_ID } = process.env;
const xRedirectUri = `${_apiBaseUrl.default}/x/callback`;
const xAuthController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            reply.redirect(`https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${X_CLIENT_ID}&redirect_uri=${xRedirectUri}&scope=tweet.read%20users.read%20follows.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`);
        } catch (error) {
            reply.redirect(`${_webBaseUrl.default}/login?error=x`);
        }
    });
    return function xAuthController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const xCallbackController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const code = request.query.code;
            if (!code) {
                reply.redirect(`${_webBaseUrl.default}/login?error=x`);
                return;
            }
            const base64Credentials = Buffer.from(`${X_API_KEY}:${X_API_KEY_SECRET}`, 'utf-8').toString('base64');
            const params = new URLSearchParams({
                code,
                grant_type: 'authorization_code',
                client_id: X_CLIENT_ID,
                redirect_uri: xRedirectUri,
                code_verifier: 'challenge'
            });
            const response = yield _axios.default.post('https://api.twitter.com/2/oauth2/token', params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Authorization': `Basic ${base64Credentials}`
                }
            });
            const { access_token } = response.data;
            reply.redirect(`${_webBaseUrl.default}/auth/x/callback?token=${access_token}`);
        } catch (error) {
            reply.redirect(`${_webBaseUrl.default}/login?error=x`);
        }
    });
    return function xCallbackController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const xUserController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const token = request.headers.x_token;
            if (!token) {
                reply.redirect(`${_webBaseUrl.default}/login?error=token`);
                return;
            }
            const response = yield _axios.default.get('https://api.twitter.com/2/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    'user.fields': 'name,id,profile_image_url'
                }
            });
            const userInfo = response.data;
            const user = {
                name: userInfo.data.name,
                email: userInfo.data.id,
                picture: userInfo.data.profile_image_url
            };
            yield (0, _createUserIfNotExists.default)(user);
            reply.status(200).send(user);
        } catch (error) {
            reply.redirect(`${_webBaseUrl.default}/login?error=x`);
        }
    });
    return function xUserController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
