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
    decrypt: function() {
        return decrypt;
    },
    decryptArray: function() {
        return decryptArray;
    },
    encrypt: function() {
        return encrypt;
    },
    encryptArray: function() {
        return encryptArray;
    }
});
const _nodecrypto = require("node:crypto");
require("dotenv/config");
const { ENC_KEY, IV } = process.env;
if (!ENC_KEY || !IV) {
    throw new Error('Encryption key or IV is not defined in environment variables.');
}
if (ENC_KEY.length !== 32 || IV.length !== 16) {
    throw new Error('Encryption key must be 32 bytes and IV must be 16 bytes.');
}
const encrypt = (data)=>{
    try {
        const cipher = (0, _nodecrypto.createCipheriv)('aes-256-cbc', Buffer.from(ENC_KEY, 'utf8'), Buffer.from(IV, 'utf8'));
        let encrypted = cipher.update(data, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Encryption failed.');
    }
};
const decrypt = (encrypted)=>{
    try {
        const decipher = (0, _nodecrypto.createDecipheriv)('aes-256-cbc', Buffer.from(ENC_KEY, 'utf8'), Buffer.from(IV, 'utf8'));
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Decryption failed.');
    }
};
const encryptArray = (array)=>{
    return array.map((item)=>encrypt(item));
};
const decryptArray = (arrayEncrypted)=>{
    return arrayEncrypted.map((item)=>decrypt(item));
};
