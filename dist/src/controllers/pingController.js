Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "pingController", {
    enumerable: true,
    get: function() {
        return pingController;
    }
});
const pingController = (request, reply)=>{
    const response = {
        ping: 'pong'
    };
    reply.status(200).send(response);
};
