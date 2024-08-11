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
    facebookAuthController: function() {
        return facebookAuthController;
    },
    facebookCallbackController: function() {
        return facebookCallbackController;
    },
    facebookUserController: function() {
        return facebookUserController;
    }
});
const _nodefs = /*#__PURE__*/ _interop_require_default(require("node:fs"));
const _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
const _nodeurl = require("node:url");
const _nodestream = require("node:stream");
const _nodeutil = require("node:util");
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
const { FACEBOOK_APP_ID, FACEBOOK_SECRET_KEY } = process.env;
const filename = (0, _nodeurl.fileURLToPath)(require("url").pathToFileURL(__filename).toString());
const dirname = _nodepath.default.dirname(filename);
const facebookAuthUrl = 'https://www.facebook.com/v11.0/dialog/oauth';
const facebookTokenUrl = 'https://graph.facebook.com/v11.0/oauth/access_token';
const facebookUserInfoUrl = 'https://graph.facebook.com/me';
const facebookRedirectUri = `${_apiBaseUrl.default}/facebook/callback`;
const buildFacebookAuthUrl = ()=>{
    const params = new URLSearchParams({
        client_id: FACEBOOK_APP_ID,
        redirect_uri: facebookRedirectUri,
        response_type: 'code',
        scope: 'email,public_profile'
    });
    return `${facebookAuthUrl}?${params.toString()}`;
};
const asyncPipeline = (0, _nodeutil.promisify)(_nodestream.pipeline);
const facebookAuthController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const url = buildFacebookAuthUrl();
            reply.redirect(url);
        } catch (error) {
            reply.redirect(`${_webBaseUrl.default}/login?error=facebook`);
        }
    });
    return function facebookAuthController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const facebookCallbackController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const code = request.query.code;
            if (!code) {
                reply.redirect(`${_webBaseUrl.default}/login?error=facebook`);
                return;
            }
            const tokenResponse = yield _axios.default.get(facebookTokenUrl, {
                params: {
                    client_id: FACEBOOK_APP_ID,
                    redirect_uri: facebookRedirectUri,
                    client_secret: FACEBOOK_SECRET_KEY,
                    code
                }
            });
            const token = tokenResponse.data.access_token;
            reply.redirect(`${_webBaseUrl.default}/auth/facebook/callback?token=${token}`);
        } catch (error) {
            reply.redirect(`${_webBaseUrl.default}/login?error=facebook`);
        }
    });
    return function facebookCallbackController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const facebookUserController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const token = request.headers.facebook_token;
            if (!token) {
                reply.redirect(`${_webBaseUrl.default}/login?error=token`);
                return;
            }
            const response = yield _axios.default.get(`${facebookUserInfoUrl}?fields=id,name,email,picture.type(large)&access_token=${token}`);
            const { id, name, email, picture } = response.data;
            const photoUrl = `${_apiBaseUrl.default}/uploads/facebook/${id}.jpg`;
            const photoPath = _nodepath.default.join(dirname, '..', '..', '..', 'uploads', 'facebook', `${id}.jpg`);
            const photoResponse = yield (0, _axios.default)({
                url: picture.data.url,
                method: 'GET',
                responseType: 'stream'
            });
            yield asyncPipeline(photoResponse.data, _nodefs.default.createWriteStream(photoPath));
            const user = {
                name,
                email,
                picture: photoUrl
            };
            yield (0, _createUserIfNotExists.default)(user);
            reply.status(200).send(user);
        } catch (error) {
            reply.redirect(`${_webBaseUrl.default}/login?error=facebook`);
        }
    });
    return function facebookUserController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
