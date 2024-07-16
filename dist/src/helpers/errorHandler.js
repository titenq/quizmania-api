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
    if (error instanceof _zod.ZodError || error.details.issues) {
        reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            issues: error instanceof _zod.ZodError ? error.issues : error.details.issues
        });
        return;
    }
    reply.send(error);
};
const _default = errorHandler;
