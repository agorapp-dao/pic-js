"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinTimeoutError = exports.BinNotFoundError = exports.BinStartMacOSArmError = exports.BinStartError = void 0;
class BinStartError extends Error {
    constructor(cause) {
        super(`There was an error starting the PocketIC Binary.

Original error: ${cause.name} ${cause.message}.
${cause.stack}`, { cause });
    }
}
exports.BinStartError = BinStartError;
class BinStartMacOSArmError extends Error {
    constructor(cause) {
        super(`There was an error starting the PocketIC Binary.

It seems you are running on an Apple Silicon Mac. The PocketIC binary can not run with the ARM architecture on Apple Silicon Macs.
Please install and enable Rosetta if it is not enabled and try again.

Original error: ${cause.name} ${cause.message}.
${cause.stack}`, { cause });
    }
}
exports.BinStartMacOSArmError = BinStartMacOSArmError;
class BinNotFoundError extends Error {
    constructor(picBinPath) {
        super(`Could not find the PocketIC binary. The PocketIC binary could not be found at ${picBinPath}. Please try installing @hadronous/pic again.`);
    }
}
exports.BinNotFoundError = BinNotFoundError;
class BinTimeoutError extends Error {
    constructor() {
        super('The PocketIC binary took too long to start. Please try again.');
    }
}
exports.BinTimeoutError = BinTimeoutError;
//# sourceMappingURL=error.js.map