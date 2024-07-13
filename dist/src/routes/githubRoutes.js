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
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const githubRedirectUri = `${_baseUrl.default}/github/callback`;
const router = _express.default.Router();
router.get('/', (req, res)=>{
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${githubRedirectUri}&scope=user:email`);
});
router.get('/callback', function() {
    var _ref = _async_to_generator(function*(req, res) {
        try {
            const code = req.query.code;
            if (!code) {
                return res.redirect(`${_frontendBaseUrl.default}/login?error=github`);
            }
            const tokenResponse = yield _axios.default.post('https://github.com/login/oauth/access_token', {
                client_id: githubClientId,
                client_secret: githubClientSecret,
                code,
                redirect_uri: githubRedirectUri
            }, {
                headers: {
                    Accept: 'application/json'
                }
            });
            const accessToken = tokenResponse.data.access_token;
            res.redirect(`${_frontendBaseUrl.default}/auth/github/callback?token=${accessToken}`);
        } catch (error) {
            res.redirect(`${_frontendBaseUrl.default}/login?error=github`);
        }
    });
    return function(req, res) {
        return _ref.apply(this, arguments);
    };
}());
router.post('/user', function() {
    var _ref = _async_to_generator(function*(req, res) {
        try {
            const token = req.headers.github_token;
            if (!token) {
                return res.redirect(`${_frontendBaseUrl.default}/login?error=token`);
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
            res.status(200).json(user);
        } catch (error) {
            res.redirect(`${_frontendBaseUrl.default}/login?error=github`);
        }
    });
    return function(req, res) {
        return _ref.apply(this, arguments);
    };
}());
const _default = router;
