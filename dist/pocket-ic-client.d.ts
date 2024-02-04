import { Principal } from '@dfinity/principal';
export declare class PocketIcClient {
    private readonly instanceUrl;
    private readonly serverUrl;
    private constructor();
    static create(url: string): Promise<PocketIcClient>;
    private static createInstance;
    deleteInstance(): Promise<void>;
    tick(): Promise<void>;
    getTime(): Promise<number>;
    setTime(time: number): Promise<void>;
    fetchRootKey(): Promise<Uint8Array>;
    checkCanisterExists(canisterId: Principal): Promise<boolean>;
    getCyclesBalance(canisterId: Principal): Promise<number>;
    addCycles(canisterId: Principal, amount: number): Promise<number>;
    uploadBlob(blob: Uint8Array): Promise<Uint8Array>;
    setStableMemory(canisterId: Principal, blobId: Uint8Array): Promise<void>;
    getStableMemory(canisterId: Principal): Promise<Uint8Array>;
    updateCall(canisterId: Principal, sender: Principal, method: string, payload: Uint8Array): Promise<Uint8Array>;
    queryCall(canisterId: Principal, sender: Principal, method: string, payload: Uint8Array): Promise<Uint8Array>;
    private canisterCall;
    private post;
    private get;
}
