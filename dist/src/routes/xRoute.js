Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _xController = require("../controllers/xController");
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
const xRoute = function() {
    var _ref = _async_to_generator(function*(fastify) {
        fastify.get('/x', {
            schema: {
                hide: true
            }
        }, _xController.xAuthController);
        fastify.get('/x/callback', {
            schema: {
                hide: true
            }
        }, _xController.xCallbackController);
        fastify.post('/x/user', {
            schema: {
                hide: true
            }
        }, _xController.xUserController);
    });
    return function xRoute(fastify) {
        return _ref.apply(this, arguments);
    };
}();
const _default = xRoute;
