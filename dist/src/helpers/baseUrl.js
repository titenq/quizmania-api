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
let baseUrl;
if (NODE_ENV === 'DEV') {
    baseUrl = 'http://localhost:4000';
} else {
    baseUrl = 'https://backend.com';
}
const _default = baseUrl;
