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
    googleAuthController: function() {
        return googleAuthController;
    },
    googleCallbackController: function() {
        return googleCallbackController;
    },
    googleUserController: function() {
        return googleUserController;
    }
});
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _createUserIfNotExists = /*#__PURE__*/ _interop_require_default(require("../helpers/createUserIfNotExists"));
const _webBaseUrl = /*#__PURE__*/ _interop_require_default(require("../helpers/webBaseUrl"));
const _apiBaseUrl = /*#__PURE__*/ _interop_require_default(require("../helpers/apiBaseUrl"));
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
const googleRedirectUri = `${_apiBaseUrl.default}/google/callback`;
const googleAuthController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            reply.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${googleRedirectUri}&response_type=code&scope=openid%20profile%20email`);
        } catch (error) {
            reply.redirect(`${_webBaseUrl.default}/login?error=google`);
        }
    });
    return function googleAuthController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const googleCallbackController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const code = request.query.code;
            if (!code) {
                reply.redirect(`${_webBaseUrl.default}/login?error=google`);
                return;
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
            reply.redirect(`${_webBaseUrl.default}/auth/google/callback?token=${token}`);
        } catch (error) {
            reply.redirect(`${_webBaseUrl.default}/login?error=google`);
        }
    });
    return function googleCallbackController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const googleUserController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const token = request.headers.google_token;
            if (!token) {
                reply.redirect(`${_webBaseUrl.default}/login?error=token`);
                return;
            }
            const userInfoResponse = yield _axios.default.get(`${googleUserInfoUrl}?access_token=${token}`);
            const userInfo = yield userInfoResponse.data;
            const user = {
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture
            };
            const userExists = yield (0, _createUserIfNotExists.default)(user);
            reply.status(200).send(userExists);
        } catch (error) {
            reply.redirect(`${_webBaseUrl.default}/login?error=google`);
        }
    });
    return function googleUserController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
