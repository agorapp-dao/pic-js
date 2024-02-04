"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PocketIc = void 0;
const principal_1 = require("@dfinity/principal");
const util_1 = require("./util");
const pocket_ic_server_1 = require("./pocket-ic-server");
const pocket_ic_client_1 = require("./pocket-ic-client");
const pocket_ic_actor_1 = require("./pocket-ic-actor");
const management_canister_1 = require("./management-canister");
/**
 * PocketIC is a local development environment for Internet Computer canisters.
 *
 * @category API
 *
 * @example
 * The easist way to use PocketIC is to use {@link setupCanister} convenience method:
 * ```ts
 * import { PocketIc } from '@hadronous/pic';
 * import { _SERVICE, idlFactory } from '../declarations';
 *
 * const wasmPath = resolve('..', '..', 'canister.wasm');
 *
 * const pic = await PocketIc.create();
 * const fixture = await pic.setupCanister<_SERVICE>(idlFactory, wasmPath);
 * const { actor } = fixture;
 *
 * // perform tests...
 *
 * await pic.tearDown();
 * ```
 *
 * If more control is needed, then the {@link createCanister}, {@link installCode} and
 * {@link createActor} methods can be used directly:
 * ```ts
 * import { PocketIc } from '@hadronous/pic';
 * import { _SERVICE, idlFactory } from '../declarations';
 *
 * const wasmPath = resolve('..', '..', 'canister.wasm');
 *
 * const pic = await PocketIc.create();
 *
 * const canisterId = await pic.createCanister();
 * await pic.installCode(canisterId, wasmPath);
 * const actor = pic.createActor<_SERVICE>(idlFactory, canisterId);
 *
 * // perform tests...
 *
 * await pic.tearDown();
 * ```
 */
class PocketIc {
    client;
    server;
    constructor(client, server) {
        this.client = client;
        this.server = server;
    }
    /**
     * Starts the PocketIC server and creates a PocketIC instance.
     *
     * @returns A new PocketIC instance.
     *
     * @example
     * ```ts
     * import { PocketIc } from '@hadronous/pic';
     *
     * const pic = await PocketIc.create();
     * ```
     */
    static async create() {
        const server = await pocket_ic_server_1.PocketIcServer.start();
        const client = await pocket_ic_client_1.PocketIcClient.create(server.getUrl());
        return new PocketIc(client, server);
    }
    /**
     * Creates a PocketIC instance that connects to an existing PocketIC server.
     *
     * @param url The URL of an existing PocketIC server to connect to.
     * @returns A new PocketIC instance.
     *
     * @example
     * ```ts
     * import { PocketIc } from '@hadronous/pic';
     *
     * const url = 'http://localhost:8080';
     * const pic = await PocketIc.createFromUrl(url);
     * ```
     */
    static async createFromUrl(url) {
        const client = await pocket_ic_client_1.PocketIcClient.create(url);
        return new PocketIc(client);
    }
    /**
     * A convenience method that creates a new canister,
     * installs the given WASM module to it and returns a typesafe {@link Actor}
     * that implements the Candid interface of the canister.
     * To just create a canister, see {@link createCanister}.
     * To just install code to an existing canister, see {@link installCode}.
     * To just create an Actor for an existing canister, see {@link createActor}.
     *
     * @param interfaceFactory The interface factory to use for the {@link Actor}.
     * @param wasm The WASM module to install to the canister.
     *  If a string is passed, it is treated as a path to a file.
     *  If an Uint8Array is passed, it is treated as the WASM module itself.
     * @param createCanisterOptions Options for creating the canister, see {@link CreateCanisterOptions}.
     * @param arg Candid encoded argument to pass to the canister's init function.
     * @param sender The Principal to send the request as.
     * @returns The {@link Actor} instance.
     *
     * @see [Candid](https://internetcomputer.org/docs/current/references/candid-ref)
     * @see [Principal](https://agent-js.icp.xyz/principal/classes/Principal.html)
     *
     * @example
     * ```ts
     * import { PocketIc } from '@hadronous/pic';
     * import { _SERVICE, idlFactory } from '../declarations';
     *
     * const wasmPath = resolve('..', '..', 'canister.wasm');
     *
     * const pic = await PocketIc.create();
     * const fixture = await pic.setupCanister<_SERVICE>(idlFactory, wasmPath);
     * const { actor } = fixture;
     * ```
     */
    async setupCanister(interfaceFactory, wasm, createCanisterOptions = {}, arg = new Uint8Array(), sender = principal_1.Principal.anonymous()) {
        const canisterId = await this.createCanister(createCanisterOptions, sender);
        await this.installCode(canisterId, wasm, arg, sender);
        const actor = this.createActor(interfaceFactory, canisterId);
        return { actor, canisterId };
    }
    /**
     * Creates a new canister.
     * For a more convenient way of creating a PocketIC instance,
     * creating a canister and installing code, see {@link setupCanister}.
     *
     * @param options Options for creating the canister, see {@link CreateCanisterOptions}.
     * @param sender The Principal to send the request as.
     * @returns The Principal of the newly created canister.
     *
     * @see [Principal](https://agent-js.icp.xyz/principal/classes/Principal.html)
     *
     * @example
     * ```ts
     * import { PocketIc } from '@hadronous/pic';
     *
     * const pic = await PocketIc.create();
     * const canisterId = await pic.createCanister();
     * ```
     */
    async createCanister(options = {}, sender = principal_1.Principal.anonymous()) {
        const cycles = options.cycles ?? 1000000000000000000n;
        const payload = (0, management_canister_1.encodeCreateCanisterRequest)({
            settings: [
                {
                    controllers: options.controllers ?? [],
                    compute_allocation: (0, util_1.optionalBigInt)(options.computeAllocation),
                    memory_allocation: (0, util_1.optionalBigInt)(options.memoryAllocation),
                    freezing_threshold: (0, util_1.optionalBigInt)(options.freezingThreshold),
                },
            ],
            amount: [cycles],
        });
        const res = await this.client.updateCall(management_canister_1.MANAGEMENT_CANISTER_ID, sender, 'provisional_create_canister_with_cycles', payload);
        return (0, management_canister_1.decodeCreateCanisterResponse)(res).canister_id;
    }
    /**
     * Installs the given WASM module to the provided canister.
     * To create a canister to install code to, see {@link createCanister}.
     * For a more convenient way of creating a PocketIC instance,
     * creating a canister and installing code, see {@link setupCanister}.
     *
     * @param canisterId The Principal of the canister to install the code to.
     * @param wasm The WASM module to install to the canister.
     *  If a string is passed, it is treated as a path to a file.
     *  If an Uint8Array is passed, it is treated as the WASM module itself.
     * @param arg Candid encoded argument to pass to the canister's init function.
     * @param sender The Principal to send the request as.
     *
     * @see [Principal](https://agent-js.icp.xyz/principal/classes/Principal.html)
     *
     * @example
     * ```ts
     * import { Principal } from '@dfinity/principal';
     * import { PocketIc } from '@hadronous/pic';
     * import { resolve } from 'node:path';
     *
     * const canisterId = Principal.fromUint8Array(new Uint8Array([0]));
     * const wasmPath = resolve('..', '..', 'canister.wasm');
     *
     * const pic = await PocketIc.create();
     * await pic.installCode(canisterId, wasmPath);
     * ```
     */
    async installCode(canisterId, wasm, arg = new Uint8Array(), sender = principal_1.Principal.anonymous()) {
        if (typeof wasm === 'string') {
            wasm = await (0, util_1.readFileAsBytes)(wasm);
        }
        const payload = (0, management_canister_1.encodeInstallCodeRequest)({
            arg,
            canister_id: canisterId,
            mode: {
                install: null,
            },
            wasm_module: wasm,
        });
        await this.client.updateCall(management_canister_1.MANAGEMENT_CANISTER_ID, sender, 'install_code', payload);
    }
    /**
     * Reinstalls the given WASM module to the provided canister.
     * This will reset both the canister's heap and its stable memory.
     * To create a canister to upgrade, see {@link createCanister}.
     * To install the initial WASM module to a new canister, see {@link installCode}.
     *
     * @param canisterId The Principal of the canister to reinstall code to.
     * @param wasm The WASM module to install to the canister.
     *  If a string is passed, it is treated as a path to a file.
     *  If an Uint8Array is passed, it is treated as the WASM module itself.
     * @param arg Candid encoded argument to pass to the canister's init function.
     * @param sender The Principal to send the request as.
     *
     * @see [Principal](https://agent-js.icp.xyz/principal/classes/Principal.html)
     *
     * @example
     * ```ts
     * import { Principal } from '@dfinity/principal';
     * import { PocketIc } from '@hadronous/pic';
     * import { resolve } from 'node:path';
     *
     * const canisterId = Principal.fromUint8Array(new Uint8Array([0]));
     * const wasmPath = resolve('..', '..', 'canister.wasm');
     *
     * const pic = await PocketIc.create();
     * await pic.reinstallCode(canisterId, wasmPath);
     * ```
     */
    async reinstallCode(canisterId, wasm, arg = new Uint8Array(), sender = principal_1.Principal.anonymous()) {
        if (typeof wasm === 'string') {
            wasm = await (0, util_1.readFileAsBytes)(wasm);
        }
        const payload = (0, management_canister_1.encodeInstallCodeRequest)({
            arg,
            canister_id: canisterId,
            mode: {
                reinstall: null,
            },
            wasm_module: wasm,
        });
        await this.client.updateCall(management_canister_1.MANAGEMENT_CANISTER_ID, sender, 'install_code', payload);
    }
    /**
     * Upgrades the given canister with the given WASM module.
     * This will reset the canister's heap, but preserve stable memory.
     * To create a canister to upgrade to, see {@link createCanister}.
     * To install the initial WASM module to a new canister, see {@link installCode}.
     *
     * @param canisterId The Principal of the canister to upgrade.
     * @param wasm The WASM module to install to the canister.
     *  If a string is passed, it is treated as a path to a file.
     *  If an Uint8Array is passed, it is treated as the WASM module itself.
     * @param arg Candid encoded argument to pass to the canister's init function.
     * @param sender The Principal to send the request as.
     *
     * @see [Principal](https://agent-js.icp.xyz/principal/classes/Principal.html)
     *
     * @example
     * ```ts
     * import { Principal } from '@dfinity/principal';
     * import { PocketIc } from '@hadronous/pic';
     * import { resolve } from 'node:path';
     *
     * const canisterId = Principal.fromUint8Array(new Uint8Array([0]));
     * const wasmPath = resolve('..', '..', 'canister.wasm');
     *
     * const pic = await PocketIc.create();
     * await pic.upgradeCanister(canisterId, wasmPath);
     * ```
     */
    async upgradeCanister(canisterId, wasm, arg = new Uint8Array(), sender = principal_1.Principal.anonymous()) {
        if (typeof wasm === 'string') {
            wasm = await (0, util_1.readFileAsBytes)(wasm);
        }
        const payload = (0, management_canister_1.encodeInstallCodeRequest)({
            arg,
            canister_id: canisterId,
            mode: {
                upgrade: null,
            },
            wasm_module: wasm,
        });
        await this.client.updateCall(management_canister_1.MANAGEMENT_CANISTER_ID, sender, 'install_code', payload);
    }
    /**
     * Creates an {@link Actor} for the given canister.
     * An {@link Actor} is a typesafe class that implements the Candid interface of a canister.
     * To create a canister for the Actor, see {@link createCanister}.
     * For a more convenient way of creating a PocketIC instance,
     * creating a canister and installing code, see {@link setupCanister}.
     *
     * @param interfaceFactory The InterfaceFactory to use for the {@link Actor}.
     * @param canisterId The Principal of the canister to create the Actor for.
     * @typeparam T The type of the {@link Actor}. Must implement {@link ActorInterface}.
     * @returns The {@link Actor} instance.
     *
     * @see [Principal](https://agent-js.icp.xyz/principal/classes/Principal.html)
     * @see [InterfaceFactory](https://agent-js.icp.xyz/candid/modules/IDL.html#InterfaceFactory)
     *
     * @example
     * ```ts
     * import { Principal } from '@dfinity/principal';
     * import { PocketIc } from '@hadronous/pic';
     * import { _SERVICE, idlFactory } from '../declarations';
     *
     * const canisterId = Principal.fromUint8Array(new Uint8Array([0]));
     *
     * const pic = await PocketIc.create();
     * const fixture = await pic.setupCanister<_SERVICE>(idlFactory, wasmPath);
     * const { actor } = fixture;
     * ```
     */
    createActor(interfaceFactory, canisterId) {
        const Actor = (0, pocket_ic_actor_1.createActorClass)(interfaceFactory, canisterId, this.client);
        return new Actor();
    }
    /**
     * Deletes the PocketIC instance and disconnects from the server.
     *
     * @example
     * ```ts
     * import { PocketIc } from '@hadronous/pic';
     *
     * const pic = await PocketIc.create();
     * await pic.tearDown();
     * ```
     */
    async tearDown() {
        await this.client.deleteInstance();
        this.server?.stop();
    }
    /**
     * Make the IC produce and progress by one block.
     *
     * ```ts
     * import { PocketIc } from '@hadronous/pic';
     *
     * const pic = await PocketIc.create();
     * await pic.tick();
     * ```
     */
    async tick() {
        return await this.client.tick();
    }
    /**
     * Get the current time of the IC in milliseconds since the Unix epoch.
     *
     * @returns The current time in milliseconds since the UNIX epoch.
     *
     * @example
     * ```ts
     * import { PocketIc } from '@hadronous/pic';
     *
     * const pic = await PocketIc.create();
     *
     * const time = await pic.getTime();
     * ```
     */
    async getTime() {
        return await this.client.getTime();
    }
    /**
     * Reset the time of the IC to the current time.
     *
     * @example
     * ```ts
     * import { PocketIc } from '@hadronous/pic';
     *
     * const pic = await PocketIc.create();
     *
     * await pic.resetTime();
     * const time = await pic.getTime();
     * ```
     */
    async resetTime() {
        await this.setTime(Date.now());
    }
    /**
     * Set the current time of the IC.
     *
     * @param time The time to set in milliseconds since the Unix epoch.
     *
     * @example
     * ```ts
     * import { PocketIc } from '@hadronous/pic';
     *
     * const pic = await PocketIc.create();
     *
     * const date = new Date();
     * await pic.setTime(date.getTime());
     * const time = await pic.getTime();
     * ```
     */
    async setTime(time) {
        await this.client.setTime(time);
    }
    /**
     * Advance the time of the IC by the given duration in milliseconds.
     *
     * @param duration The duration to advance the time by.
     *
     * @example
     * ```ts
     * import { PocketIc } from '@hadronous/pic';
     *
     * const pic = await PocketIc.create();
     *
     * const initialTime = await pic.getTime();
     * await pic.advanceTime(1_000);
     * const newTime = await pic.getTime();
     * ```
     */
    async advanceTime(duration) {
        const currentTime = await this.getTime();
        const newTime = currentTime + duration;
        await this.setTime(newTime);
    }
    /**
     * Fetch the root key of the IC.
     *
     * @returns The root key of the IC.
     *
     * @example
     * ```ts
     * import { PocketIc } from '@hadronous/pic';
     *
     * const pic = await PocketIc.create();
     * const rootKey = await pic.fetchRootKey();
     */
    async fetchRootKey() {
        return await this.client.fetchRootKey();
    }
    /**
     * Checks if the provided canister exists.
     *
     * @param canisterId The Principal of the canister to check.
     * @returns `true` if the canister exists, `false` otherwise.
     *
     * @see [Principal](https://agent-js.icp.xyz/principal/classes/Principal.html)
     *
     * @example
     * ```ts
     * import { PocketIc } from '@hadronous/pic';
     *
     * const canisterId = Principal.fromUint8Array(new Uint8Array([0]));
     *
     * const pic = await PocketIc.create();
     * const canisterExists = await pic.checkCanisterExists(canisterId);
     * ```
     */
    async checkCanisterExists(canisterId) {
        return await this.client.checkCanisterExists(canisterId);
    }
    /**
     * Gets the current cycle balance of the specified canister.
     *
     * @param canisterId The Principal of the canister to check.
     * @returns The current cycles balance of the canister.
     *
     * @see [Principal](https://agent-js.icp.xyz/principal/classes/Principal.html)
     *
     * @example
     * ```ts
     * import { Principal } from '@dfinity/principal';
     * import { PocketIc } from '@hadronous/pic';
     *
     * const canisterId = Principal.fromUint8Array(new Uint8Array([0]));
     *
     * const pic = await PocketIc.create();
     * const cyclesBalance = await pic.getCyclesBalance(canisterId);
     * ```
     */
    async getCyclesBalance(canisterId) {
        return await this.client.getCyclesBalance(canisterId);
    }
    /**
     * Add cycles to the specified canister.
     *
     * @param canisterId The Principal of the canister to add cycles to.
     * @param amount The amount of cycles to add.
     * @returns The new cycle balance of the canister.
     *
     * @see [Principal](https://agent-js.icp.xyz/principal/classes/Principal.html)
     *
     * @example
     * ```ts
     * import { Principal } from '@dfinity/principal';
     * import { PocketIc } from '@hadronous/pic';
     *
     * const canisterId = Principal.fromUint8Array(new Uint8Array([0]));
     *
     * const pic = await PocketIc.create();
     * const newCyclesBalance = await pic.addCycles(canisterId, 10_000_000);
     * ```
     */
    async addCycles(canisterId, amount) {
        return await this.client.addCycles(canisterId, amount);
    }
    /**
     * Set the stable memory of a given canister.
     *
     * @param canisterId The Principal of the canister to set the stable memory of.
     * @param stableMemory A blob containing the stable memory to set.
     *
     * @see [Principal](https://agent-js.icp.xyz/principal/classes/Principal.html)
     *
     * @example
     * ```ts
     * import { Principal } from '@dfinity/principal';
     * import { PocketIc } from '@hadronous/pic';
     *
     * const canisterId = Principal.fromUint8Array(new Uint8Array([0]));
     * const stableMemory = new Uint8Array([0, 1, 2, 3, 4]);
     *
     * const pic = await PocketIc.create();
     * await pic.setStableMemory(canisterId, stableMemory);
     * ```
     */
    async setStableMemory(canisterId, stableMemory) {
        const blobId = await this.client.uploadBlob(stableMemory);
        await this.client.setStableMemory(canisterId, blobId);
    }
    /**
     * Get the stable memory of a given canister.
     *
     * @param canisterId The Principal of the canister to get the stable memory of.
     * @returns A blob containing the canister's stable memory.
     *
     * @see [Principal](https://agent-js.icp.xyz/principal/classes/Principal.html)
     *
     * @example
     * ```ts
     * import { Principal } from '@dfinity/principal';
     * import { PocketIc } from '@hadronous/pic';
     *
     * const canisterId = Principal.fromUint8Array(new Uint8Array([0]));
     *
     * const pic = await PocketIc.create();
     * const stableMemory = await pic.getStableMemory(canisterId);
     * ```
     */
    async getStableMemory(canisterId) {
        return await this.client.getStableMemory(canisterId);
    }
}
exports.PocketIc = PocketIc;
//# sourceMappingURL=pocket-ic.js.map