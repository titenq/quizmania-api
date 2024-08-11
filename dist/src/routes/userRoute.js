Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _userController = require("../controllers/userController");
const _userSchema = require("../schemas/userSchema");
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
const userRoute = function() {
    var _ref = _async_to_generator(function*(fastify) {
        fastify.withTypeProvider().post('/users', {
            schema: _userSchema.userCreateSchema
        }, _userController.createUserController);
        fastify.withTypeProvider().get('/users/:email', {
            schema: _userSchema.userGetByEmailSchema
        }, _userController.getUserByEmailController);
    });
    return function userRoute(fastify) {
        return _ref.apply(this, arguments);
    };
}();
const _default = userRoute;
