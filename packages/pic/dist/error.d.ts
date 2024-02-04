export declare class BinStartError extends Error {
    constructor(cause: Error);
}
export declare class BinStartMacOSArmError extends Error {
    constructor(cause: Error);
}
export declare class BinNotFoundError extends Error {
    constructor(picBinPath: string);
}
export declare class BinTimeoutError extends Error {
    constructor();
}
