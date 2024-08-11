Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _db = /*#__PURE__*/ _interop_require_default(require("../db"));
const _cryptography = require("../helpers/cryptography");
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
const UserSchema = new _db.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    picture: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'users'
});
UserSchema.pre('save', function() {
    var _ref = _async_to_generator(function*(next) {
        const emailEncrypt = (0, _cryptography.encrypt)(this.email);
        this.email = emailEncrypt;
        next();
    });
    return function(next) {
        return _ref.apply(this, arguments);
    };
}());
UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    user.email = (0, _cryptography.decrypt)(user.email);
    return user;
};
const UserModel = _db.default.model('User', UserSchema);
const _default = UserModel;
