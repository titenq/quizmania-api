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
    Required: function() {
        return Required;
    },
    Type: function() {
        return Type;
    },
    genMsgError: function() {
        return genMsgError;
    }
});
var Type;
(function(Type) {
    Type["STRING"] = "deve ser um texto";
    Type["NUMBER"] = "deve ser um número";
    Type["BOOLEAN"] = "deve ser um booleano";
    Type["DATE"] = "com formato inválido";
    Type["UUID"] = "com UUID inválido";
    Type["INT"] = "deve ser um número inteiro";
    Type["POSITIVE"] = "deve ser um número inteiro positivo";
    Type["NONNEGATIVE"] = "não pode ser um número negativo";
    Type["MIN"] = "deve ter o número mínimo de caracteres igual a";
    Type["MAX"] = "deve ter o número máximo de caracteres igual a";
    Type["LENGTH"] = "deve ter o número de elementos igual a";
    Type["EMAIL"] = "com formato inválido";
    Type["URL"] = "com formato inválido";
})(Type || (Type = {}));
var Required;
(function(Required) {
    Required[Required["TRUE"] = 0] = "TRUE";
    Required[Required["FALSE"] = 1] = "FALSE";
    Required[Required["NULL"] = 2] = "NULL";
})(Required || (Required = {}));
const getRequiredError = (field, type)=>{
    return {
        required_error: `${field} é obrigatório`,
        invalid_type_error: `${field} ${type}`
    };
};
const getInvalidTypeError = (field, type)=>{
    return {
        invalid_type_error: `${field} ${type}`
    };
};
const getMessage = (field, type, value)=>{
    if (value) {
        return {
            message: `${field} ${type} ${value}`
        };
    }
    return {
        message: `${field} ${type}`
    };
};
const genMsgError = (field, type, required, value)=>{
    if (required === 0) {
        return getRequiredError(field, type);
    }
    if (required === 1) {
        return getInvalidTypeError(field, type);
    }
    if (value) {
        return getMessage(field, type, value);
    }
    return getMessage(field, type);
};
