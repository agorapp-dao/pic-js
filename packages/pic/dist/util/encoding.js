"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexDecode = exports.base64Decode = exports.base64EncodePrincipal = exports.base64Encode = void 0;
function base64Encode(payload) {
    return Buffer.from(payload).toString('base64');
}
exports.base64Encode = base64Encode;
function base64EncodePrincipal(principal) {
    return base64Encode(principal.toUint8Array());
}
exports.base64EncodePrincipal = base64EncodePrincipal;
function base64Decode(payload) {
    return new Uint8Array(Buffer.from(payload, 'base64'));
}
exports.base64Decode = base64Decode;
function hexDecode(payload) {
    return new Uint8Array(Buffer.from(payload, 'hex'));
}
exports.hexDecode = hexDecode;
//# sourceMappingURL=encoding.js.map