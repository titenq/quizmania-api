Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _googleController = require("../controllers/googleController");
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
const googleRoute = function() {
    var _ref = _async_to_generator(function*(fastify) {
        fastify.get('/google', {
            schema: {
                hide: true
            }
        }, _googleController.googleAuthController);
        fastify.get('/google/callback', {
            schema: {
                hide: true
            }
        }, _googleController.googleCallbackController);
        fastify.post('/google/user', {
            schema: {
                hide: true
            }
        }, _googleController.googleUserController);
    });
    return function googleRoute(fastify) {
        return _ref.apply(this, arguments);
    };
}();
const _default = googleRoute;
