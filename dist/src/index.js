Object.defineProperty(exports, "__esModule", {
    value: true
});
const _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
const _nodeurl = require("node:url");
require("dotenv/config");
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _expresssession = /*#__PURE__*/ _interop_require_default(require("express-session"));
const _cors = /*#__PURE__*/ _interop_require_default(require("cors"));
const _helmet = /*#__PURE__*/ _interop_require_default(require("helmet"));
const _baseUrl = /*#__PURE__*/ _interop_require_default(require("./helpers/baseUrl"));
const _siteOrigin = /*#__PURE__*/ _interop_require_default(require("./helpers/siteOrigin"));
const _googleRoutes = /*#__PURE__*/ _interop_require_default(require("./routes/googleRoutes"));
const _facebookRoutes = /*#__PURE__*/ _interop_require_default(require("./routes/facebookRoutes"));
const _xRoutes = /*#__PURE__*/ _interop_require_default(require("./routes/xRoutes"));
const _githubRoutes = /*#__PURE__*/ _interop_require_default(require("./routes/githubRoutes"));
const _logoutRoutes = /*#__PURE__*/ _interop_require_default(require("./routes/logoutRoutes"));
const _pingRoutes = /*#__PURE__*/ _interop_require_default(require("./routes/pingRoutes"));
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
const { PORT, SECRET, NAME_SESSION, NODE_ENV } = process.env;
const app = (0, _express.default)();
app.use(_express.default.json());
app.use((0, _helmet.default)({
    contentSecurityPolicy: false,
    frameguard: false
}));
app.use((0, _expresssession.default)({
    name: NAME_SESSION,
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV === 'PROD',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 dia
    }
}));
app.use((0, _cors.default)({
    origin: _siteOrigin.default,
    credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Access-Control-Allow-Origin',
        'facebook_token',
        'github_token',
        'google_token',
        'x_token'
    ]
}));
app.use('/uploads/facebook', _express.default.static(_nodepath.default.join(dirname, '..', '..', 'uploads', 'facebook')));
app.use('/google', _googleRoutes.default);
app.use('/facebook', _facebookRoutes.default);
app.use('/x', _xRoutes.default);
app.use('/github', _githubRoutes.default);
app.use('/logout', _logoutRoutes.default);
app.use('/ping', _pingRoutes.default);
const pingEndpoint = ()=>{
    setInterval(/*#__PURE__*/ _async_to_generator(function*() {
        try {
            const response = yield _axios.default.get(`${_baseUrl.default}/ping`);
            console.log('Ping response:', response.data);
        } catch (err) {
            console.error('Erro ao fazer ping:', err);
        }
    }), 840000); // 14 minutos
};
app.listen(PORT, ()=>{
    console.log(`Server running on ${_baseUrl.default}`);
    pingEndpoint();
});
