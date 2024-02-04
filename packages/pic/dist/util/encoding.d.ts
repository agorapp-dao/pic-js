import { Principal } from '@dfinity/principal';
export declare function base64Encode(payload: Uint8Array): string;
export declare function base64EncodePrincipal(principal: Principal): string;
export declare function base64Decode(payload: string): Uint8Array;
export declare function hexDecode(payload: string): Uint8Array;
