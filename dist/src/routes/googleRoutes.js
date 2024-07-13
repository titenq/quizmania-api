Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
require("dotenv/config");
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
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
const router = _express.default.Router();
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleTokenUrl = 'https://oauth2.googleapis.com/token';
const googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
const googleRedirectUri = `${_baseUrl.default}/google/callback`;
router.get('/', (req, res)=>{
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=openid%20profile%20email`);
});
router.get('/callback', function() {
    var _ref = _async_to_generator(function*(req, res) {
        const code = req.query.code;
        if (!code) {
            return res.redirect(`${_frontendBaseUrl.default}/login?error=google`);
        }
        try {
            const tokenResponse = yield _axios.default.post(googleTokenUrl, new URLSearchParams({
                code,
                client_id: googleClientId,
                client_secret: googleClientSecret,
                redirect_uri: googleRedirectUri,
                grant_type: 'authorization_code'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const token = tokenResponse.data.access_token;
            res.redirect(`${_frontendBaseUrl.default}/auth/google/callback?token=${token}`);
        } catch (error) {
            res.redirect(`${_frontendBaseUrl.default}/login?error=google`);
        }
    });
    return function(req, res) {
        return _ref.apply(this, arguments);
    };
}());
router.post('/user', function() {
    var _ref = _async_to_generator(function*(req, res) {
        try {
            const token = req.headers.google_token;
            if (!token) {
                return res.redirect(`${_frontendBaseUrl.default}/login?error=token`);
            }
            const userInfoResponse = yield _axios.default.get(`${googleUserInfoUrl}?access_token=${token}`);
            const userInfo = yield userInfoResponse.data;
            const user = {
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture
            };
            yield (0, _createUserIfNotExists.default)(user);
            res.status(200).json(user);
        } catch (error) {
            res.redirect(`${_frontendBaseUrl.default}/login?error=google`);
        }
    });
    return function(req, res) {
        return _ref.apply(this, arguments);
    };
}());
const _default = router;
