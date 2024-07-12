Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _nodefs = /*#__PURE__*/ _interop_require_default(require("node:fs"));
const _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
const _nodeurl = require("node:url");
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _baseUrl = /*#__PURE__*/ _interop_require_default(require("../helpers/baseUrl"));
const _frontendBaseUrl = /*#__PURE__*/ _interop_require_default(require("../helpers/frontendBaseUrl"));
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
const filename = (0, _nodeurl.fileURLToPath)(require("url").pathToFileURL(__filename).toString());
const dirname = _nodepath.default.dirname(filename);
const facebookAppId = process.env.FACEBOOK_APP_ID;
const facebookSecretKey = process.env.FACEBOOK_SECRET_KEY;
const facebookAuthUrl = 'https://www.facebook.com/v11.0/dialog/oauth';
const facebookTokenUrl = 'https://graph.facebook.com/v11.0/oauth/access_token';
const facebookUserInfoUrl = 'https://graph.facebook.com/me';
const facebookRedirectUri = `${_baseUrl.default}/facebook/callback`;
const router = _express.default.Router();
const buildFacebookAuthUrl = ()=>{
    const params = new URLSearchParams({
        client_id: facebookAppId,
        redirect_uri: facebookRedirectUri,
        response_type: 'code',
        scope: 'email,public_profile'
    });
    return `${facebookAuthUrl}?${params.toString()}`;
};
router.get('/', (req, res)=>{
    const url = buildFacebookAuthUrl();
    res.redirect(url);
});
router.get('/callback', function() {
    var _ref = _async_to_generator(function*(req, res) {
        const code = req.query.code;
        if (!code) {
            return res.redirect(`${_frontendBaseUrl.default}/login?error=facebook`);
        }
        try {
            const tokenResponse = yield _axios.default.get(facebookTokenUrl, {
                params: {
                    client_id: facebookAppId,
                    redirect_uri: facebookRedirectUri,
                    client_secret: facebookSecretKey,
                    code
                }
            });
            const token = tokenResponse.data.access_token;
            return res.redirect(`${_frontendBaseUrl.default}/auth/facebook/callback?token=${token}`);
        } catch (error) {
            return res.redirect(`${_frontendBaseUrl.default}/login?error=facebook`);
        }
    });
    return function(req, res) {
        return _ref.apply(this, arguments);
    };
}());
router.post('/user', function() {
    var _ref = _async_to_generator(function*(req, res) {
        try {
            const token = req.headers.facebook_token;
            if (!token) {
                return res.redirect(`${_frontendBaseUrl.default}/login?error=token`);
            }
            const response = yield _axios.default.get(`${facebookUserInfoUrl}?fields=id,name,email,picture.type(large)&access_token=${token}`);
            const id = response.data.id;
            const name = response.data.name;
            const email = response.data.email;
            const photo = response.data.picture.data.url;
            const photoResponse = yield (0, _axios.default)({
                url: photo,
                method: 'GET',
                responseType: 'stream'
            });
            const photoPath = _nodepath.default.join(dirname, '..', '..', '..', 'uploads', 'facebook', `${id}.jpg`);
            const writer = _nodefs.default.createWriteStream(photoPath);
            photoResponse.data.pipe(writer);
            writer.on('finish', ()=>{
                const photoUrl = `${_baseUrl.default}/uploads/facebook/${id}.jpg`;
                const user = {
                    name,
                    email,
                    picture: photoUrl
                };
                res.status(200).json(user);
            });
            writer.on('error', (error)=>{
                return res.redirect(`${_frontendBaseUrl.default}/login?error=facebook`);
            });
        } catch (error) {
            return res.redirect(`${_frontendBaseUrl.default}/login?error=facebook`);
        }
    });
    return function(req, res) {
        return _ref.apply(this, arguments);
    };
}());
const _default = router;
