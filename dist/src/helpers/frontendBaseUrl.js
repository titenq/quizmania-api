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
const { NODE_ENV } = process.env;
let frontendBaseUrl;
if (NODE_ENV === 'DEV') {
    frontendBaseUrl = 'http://localhost:5173';
} else {
    frontendBaseUrl = 'https://frontend.com';
}
const _default = frontendBaseUrl;
