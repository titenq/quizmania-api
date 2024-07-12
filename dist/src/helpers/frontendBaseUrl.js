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
let frontendBaseUrl;
if (nodeEnv === 'DEV') {
    frontendBaseUrl = 'http://localhost:5173';
} else {
    frontendBaseUrl = 'https://frontend.com';
}
const _default = frontendBaseUrl;
