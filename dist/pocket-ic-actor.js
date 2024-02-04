"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActorClass = void 0;
const candid_1 = require("@dfinity/candid");
const principal_1 = require("@dfinity/principal");
function createActorClass(interfaceFactory, canisterId, pocketIcClient) {
    const service = interfaceFactory({ IDL: candid_1.IDL });
    let sender = null;
    function decodeReturnValue(types, msg) {
        const returnValues = candid_1.IDL.decode(types, msg);
        switch (returnValues.length) {
            case 0:
                return undefined;
            case 1:
                return returnValues[0];
            default:
                return returnValues;
        }
    }
    function createActorMethod(methodName, func) {
        if (func.annotations.includes('query') ||
            func.annotations.includes('composite_query')) {
            return createQueryMethod(methodName, func);
        }
        return createCallMethod(methodName, func);
    }
    function getSender() {
        return sender ?? principal_1.Principal.anonymous();
    }
    function createQueryMethod(methodName, func) {
        return async function (...args) {
            const arg = candid_1.IDL.encode(func.argTypes, args);
            const sender = getSender();
            const response = await pocketIcClient.queryCall(canisterId, sender, methodName, new Uint8Array(arg));
            return decodeReturnValue(func.retTypes, response);
        };
    }
    function createCallMethod(methodName, func) {
        return async function (...args) {
            const arg = candid_1.IDL.encode(func.argTypes, args);
            const sender = getSender();
            const response = await pocketIcClient.updateCall(canisterId, sender, methodName, new Uint8Array(arg));
            return decodeReturnValue(func.retTypes, response);
        };
    }
    function Actor() { }
    Actor.prototype.setPrincipal = function (newSender) {
        sender = newSender;
    };
    Actor.prototype.setIdentity = function (identity) {
        sender = identity.getPrincipal();
    };
    service._fields.forEach(([methodName, func]) => {
        Actor.prototype[methodName] = createActorMethod(methodName, func);
    });
    return Actor;
}
exports.createActorClass = createActorClass;
//# sourceMappingURL=pocket-ic-actor.js.map