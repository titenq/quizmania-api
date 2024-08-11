Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _zod = require("zod");
const errorHandler = (error, request, reply)=>{
    var _error_details;
    if (error instanceof _zod.ZodError || (error === null || error === void 0 ? void 0 : (_error_details = error.details) === null || _error_details === void 0 ? void 0 : _error_details.issues)) {
        reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            issues: error instanceof _zod.ZodError ? error.issues : error.details.issues
        });
        return;
    }
    const statusCode = (error === null || error === void 0 ? void 0 : error.statusCode) || 500;
    reply.status(statusCode).send(error);
};
const _default = errorHandler;
