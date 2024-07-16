Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    userCreateSchema: function() {
        return userCreateSchema;
    },
    userGetByEmailSchema: function() {
        return userGetByEmailSchema;
    }
});
const _zod = require("zod");
const _genMsgError = require("../helpers/genMsgError");
const userCreateSchema = {
    summary: 'Criar usuário',
    tags: [
        'Usuários'
    ],
    body: _zod.z.object({
        name: _zod.z.string((0, _genMsgError.genMsgError)('name', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
        email: _zod.z.string((0, _genMsgError.genMsgError)('email', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
        picture: _zod.z.string((0, _genMsgError.genMsgError)('picture', _genMsgError.Type.STRING, _genMsgError.Required.NULL))
    }).describe('<b>name:</b> string (mínimo 4 caracteres, máximo 64 caracteres)\n<b>email:</b> string\n<b>picture:</b> string'),
    response: {
        201: _zod.z.object({
            userId: _zod.z.string((0, _genMsgError.genMsgError)('_id', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            name: _zod.z.string((0, _genMsgError.genMsgError)('name', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            email: _zod.z.string((0, _genMsgError.genMsgError)('email', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            picture: _zod.z.string((0, _genMsgError.genMsgError)('picture', _genMsgError.Type.STRING, _genMsgError.Required.NULL)).nullish(),
            createdAt: _zod.z.date((0, _genMsgError.genMsgError)('createdAt', _genMsgError.Type.DATE, _genMsgError.Required.TRUE))
        })
    }
};
const userGetByEmailSchema = {
    summary: 'Buscar usuário pelo e-mail',
    tags: [
        'Usuários'
    ],
    params: _zod.z.object({
        email: _zod.z.string((0, _genMsgError.genMsgError)('email', _genMsgError.Type.STRING, _genMsgError.Required.TRUE))
    }).describe('<b>name:</b> string (mínimo 4 caracteres, máximo 64 caracteres)\n<b>email:</b> string\n<b>picture:</b> string'),
    response: {
        201: _zod.z.object({
            userId: _zod.z.string((0, _genMsgError.genMsgError)('_id', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            name: _zod.z.string((0, _genMsgError.genMsgError)('name', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            email: _zod.z.string((0, _genMsgError.genMsgError)('email', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            picture: _zod.z.string((0, _genMsgError.genMsgError)('picture', _genMsgError.Type.STRING, _genMsgError.Required.NULL)).nullish(),
            createdAt: _zod.z.date((0, _genMsgError.genMsgError)('createdAt', _genMsgError.Type.DATE, _genMsgError.Required.TRUE))
        })
    }
};
