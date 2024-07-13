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
const xApiKey = process.env.X_API_KEY;
const xApiKeySecret = process.env.X_API_KEY_SECRET;
const xClientId = process.env.X_CLIENT_ID;
const xRedirectUri = `${_baseUrl.default}/x/callback`;
router.get('/', (req, res)=>{
    res.redirect(`https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${xClientId}&redirect_uri=${xRedirectUri}&scope=tweet.read%20users.read%20follows.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`);
});
router.get('/callback', function() {
    var _ref = _async_to_generator(function*(req, res) {
        const code = req.query.code;
        if (!code) {
            return res.redirect(`${_frontendBaseUrl.default}/login?error=x`);
        }
        try {
            const base64Credentials = Buffer.from(`${xApiKey}:${xApiKeySecret}`, 'utf-8').toString('base64');
            const params = new URLSearchParams({
                code,
                grant_type: 'authorization_code',
                client_id: xClientId,
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
            res.redirect(`${_frontendBaseUrl.default}/auth/x/callback?token=${access_token}`);
        } catch (error) {
            res.redirect(`${_frontendBaseUrl.default}/login?error=x`);
        }
    });
    return function(req, res) {
        return _ref.apply(this, arguments);
    };
}());
router.post('/user', function() {
    var _ref = _async_to_generator(function*(req, res) {
        const token = req.headers.x_token;
        if (!token) {
            return res.redirect(`${_frontendBaseUrl.default}/login?error=token`);
        }
        try {
            const response = yield _axios.default.get('https://api.twitter.com/2/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    'user.fields': 'name,id,profile_image_url'
                }
            });
            const userInfo = response.data;
            console.log(userInfo);
            const user = {
                name: userInfo.data.name,
                email: userInfo.data.id,
                picture: userInfo.data.profile_image_url
            };
            yield (0, _createUserIfNotExists.default)(user);
            res.status(200).json(user);
        } catch (error) {
            res.redirect(`${_frontendBaseUrl.default}/login?error=x`);
        }
    });
    return function(req, res) {
        return _ref.apply(this, arguments);
    };
}());
const _default = router;
