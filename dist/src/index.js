Object.defineProperty(exports, "__esModule", {
    value: true
});
const _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
const _nodeurl = require("node:url");
require("dotenv/config");
const _fastify = /*#__PURE__*/ _interop_require_default(require("fastify"));
const _helmet = /*#__PURE__*/ _interop_require_default(require("@fastify/helmet"));
const _cors = /*#__PURE__*/ _interop_require_default(require("@fastify/cors"));
const _cookie = /*#__PURE__*/ _interop_require_default(require("@fastify/cookie"));
const _session = /*#__PURE__*/ _interop_require_default(require("@fastify/session"));
const _static = /*#__PURE__*/ _interop_require_default(require("@fastify/static"));
const _swagger = /*#__PURE__*/ _interop_require_default(require("@fastify/swagger"));
const _swaggerui = /*#__PURE__*/ _interop_require_default(require("@fastify/swagger-ui"));
const _fastifytypeproviderzod = require("fastify-type-provider-zod");
const _indexRoute = /*#__PURE__*/ _interop_require_default(require("./routes/indexRoute"));
const _apiBaseUrl = /*#__PURE__*/ _interop_require_default(require("./helpers/apiBaseUrl"));
const _siteOrigin = /*#__PURE__*/ _interop_require_default(require("./helpers/siteOrigin"));
const _pingEndpoint = /*#__PURE__*/ _interop_require_default(require("./helpers/pingEndpoint"));
const _errorHandler = /*#__PURE__*/ _interop_require_default(require("./helpers/errorHandler"));
const _swaggerOptions = require("./helpers/swaggerOptions");
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
const app = (0, _fastify.default)();
app.register(_helmet.default);
app.register(_cors.default, {
    origin: _siteOrigin.default,
    credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Access-Control-Allow-Origin',
        'api_key',
        'facebook_token',
        'github_token',
        'google_token',
        'x_token'
    ],
    methods: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE'
    ]
});
app.register(_cookie.default);
app.register(_session.default, {
    secret: SECRET,
    cookieName: NAME_SESSION,
    cookie: {
        secure: NODE_ENV === 'PROD',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 dia
    }
});
app.register(_static.default, {
    root: _nodepath.default.join(dirname, '..', '..', 'uploads', 'facebook'),
    prefix: '/uploads/facebook/'
});
app.register(_swagger.default, _swaggerOptions.fastifySwaggerOptions);
app.register(_swaggerui.default, _swaggerOptions.fastifySwaggerUiOptions);
app.setValidatorCompiler(_fastifytypeproviderzod.validatorCompiler);
app.setSerializerCompiler(_fastifytypeproviderzod.serializerCompiler);
app.setErrorHandler(_errorHandler.default);
const startServer = function() {
    var _ref = _async_to_generator(function*() {
        yield (0, _indexRoute.default)(app);
        yield app.listen({
            port: Number(PORT),
            host: '0.0.0.0'
        });
        (0, _pingEndpoint.default)();
    });
    return function startServer() {
        return _ref.apply(this, arguments);
    };
}();
try {
    startServer();
    console.log(`Server started in ${_apiBaseUrl.default}`);
    console.log(`API Doc: ${_apiBaseUrl.default}/docs`);
} catch (error) {
    console.error(error);
}
