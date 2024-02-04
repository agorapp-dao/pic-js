"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeInstallCodeRequest = exports.decodeCreateCanisterResponse = exports.encodeCreateCanisterRequest = exports.CanisterSettings = exports.MANAGEMENT_CANISTER_ID = void 0;
const candid_1 = require("@dfinity/candid");
const principal_1 = require("@dfinity/principal");
exports.MANAGEMENT_CANISTER_ID = principal_1.Principal.fromText('aaaaa-aa');
exports.CanisterSettings = candid_1.IDL.Opt(candid_1.IDL.Record({
    controllers: candid_1.IDL.Opt(candid_1.IDL.Vec(candid_1.IDL.Principal)),
    compute_allocation: candid_1.IDL.Opt(candid_1.IDL.Nat),
    memory_allocation: candid_1.IDL.Opt(candid_1.IDL.Nat),
    freezing_threshold: candid_1.IDL.Opt(candid_1.IDL.Nat),
}));
const CreateCanisterRequest = candid_1.IDL.Record({
    settings: exports.CanisterSettings,
    amount: candid_1.IDL.Opt(candid_1.IDL.Nat),
});
function encodeCreateCanisterRequest(arg) {
    return new Uint8Array(candid_1.IDL.encode([CreateCanisterRequest], [arg]));
}
exports.encodeCreateCanisterRequest = encodeCreateCanisterRequest;
const CreateCanisterResponse = candid_1.IDL.Record({
    canister_id: candid_1.IDL.Principal,
});
function decodeCreateCanisterResponse(arg) {
    const [payload] = candid_1.IDL.decode([CreateCanisterResponse], arg);
    // [TODO] - type check?
    return payload;
}
exports.decodeCreateCanisterResponse = decodeCreateCanisterResponse;
const InstallCodeRequest = candid_1.IDL.Record({
    arg: candid_1.IDL.Vec(candid_1.IDL.Nat8),
    wasm_module: candid_1.IDL.Vec(candid_1.IDL.Nat8),
    mode: candid_1.IDL.Variant({
        reinstall: candid_1.IDL.Null,
        upgrade: candid_1.IDL.Null,
        install: candid_1.IDL.Null,
    }),
    canister_id: candid_1.IDL.Principal,
});
function encodeInstallCodeRequest(arg) {
    return new Uint8Array(candid_1.IDL.encode([InstallCodeRequest], [arg]));
}
exports.encodeInstallCodeRequest = encodeInstallCodeRequest;
//# sourceMappingURL=management-canister.js.map