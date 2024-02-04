import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
export declare const MANAGEMENT_CANISTER_ID: Principal;
export interface CanisterSettings {
    controllers: Principal[];
    compute_allocation: [] | [bigint];
    memory_allocation: [] | [bigint];
    freezing_threshold: [] | [bigint];
}
export declare const CanisterSettings: IDL.OptClass<Record<string, any>>;
export interface CreateCanisterRequest {
    settings: [] | [CanisterSettings];
    amount: [] | [bigint];
}
export declare function encodeCreateCanisterRequest(arg: CreateCanisterRequest): Uint8Array;
export interface CreateCanisterResponse {
    canister_id: Principal;
}
export declare function decodeCreateCanisterResponse(arg: Uint8Array): CreateCanisterResponse;
export interface InstallCodeRequest {
    arg: Uint8Array;
    wasm_module: Uint8Array;
    mode: {
        reinstall?: null;
        upgrade?: null;
        install?: null;
    };
    canister_id: Principal;
}
export declare function encodeInstallCodeRequest(arg: InstallCodeRequest): Uint8Array;
