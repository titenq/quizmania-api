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
const nodeEnv = process.env.NODE_ENV;
let baseUrl;
if (nodeEnv === 'DEV') {
    baseUrl = 'http://localhost:4000';
} else {
    baseUrl = 'https://backend.com';
}
const _default = baseUrl;
