"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PocketIcServer = void 0;
const node_child_process_1 = require("node:child_process");
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
const error_1 = require("./error");
const util_1 = require("./util");
class PocketIcServer {
    serverProcess;
    url;
    constructor(serverProcess, portNumber) {
        this.serverProcess = serverProcess;
        this.url = `http://127.0.0.1:${portNumber}`;
    }
    static async start() {
        const binPath = this.getBinPath();
        await this.assertBinExists(binPath);
        const pid = process.ppid;
        const picFilePrefix = `pocket_ic_${pid}`;
        const portFilePath = (0, util_1.tmpFile)(`${picFilePrefix}.port`);
        const readyFilePath = (0, util_1.tmpFile)(`${picFilePrefix}.ready`);
        const serverProcess = (0, node_child_process_1.spawn)(binPath, ['--pid', pid.toString()], {
            stdio: ['ignore', 'pipe', 'pipe'],
        });
        serverProcess.on('error', error => {
            if ((0, util_1.isArm)() && (0, util_1.isDarwin)()) {
                throw new error_1.BinStartMacOSArmError(error);
            }
            throw new error_1.BinStartError(error);
        });
        return await (0, util_1.poll)(async () => {
            const isPocketIcReady = await (0, util_1.exists)(readyFilePath);
            if (isPocketIcReady) {
                const portString = await (0, util_1.readFileAsString)(portFilePath);
                const port = parseInt(portString);
                return new PocketIcServer(serverProcess, port);
            }
            throw new error_1.BinTimeoutError();
        });
    }
    getUrl() {
        return this.url;
    }
    stop() {
        this.serverProcess.unref();
    }
    static getBinPath() {
        return (0, node_path_1.resolve)(__dirname, '..', 'pocket-ic');
    }
    static async assertBinExists(binPath) {
        const binExists = await (0, util_1.exists)(binPath);
        if (!binExists) {
            throw new error_1.BinNotFoundError(binPath);
        }
        (0, node_fs_1.chmodSync)(binPath, 0o700);
    }
}
exports.PocketIcServer = PocketIcServer;
//# sourceMappingURL=pocket-ic-server.js.map