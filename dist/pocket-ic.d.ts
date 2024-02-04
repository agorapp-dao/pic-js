import { Principal } from '@dfinity/principal';
import { IDL } from '@dfinity/candid';
import { ActorInterface, Actor } from './pocket-ic-actor';
import { CanisterFixture, CreateCanisterOptions } from './pocket-ic-types';
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
export declare class PocketIc {
    private readonly client;
    private readonly server?;
    private constructor();
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
    static create(): Promise<PocketIc>;
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
    static createFromUrl(url: string): Promise<PocketIc>;
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
    setupCanister<T = ActorInterface>(interfaceFactory: IDL.InterfaceFactory, wasm: Uint8Array | string, createCanisterOptions?: CreateCanisterOptions, arg?: Uint8Array, sender?: Principal): Promise<CanisterFixture<T>>;
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
    createCanister(options?: CreateCanisterOptions, sender?: Principal): Promise<Principal>;
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
    installCode(canisterId: Principal, wasm: Uint8Array | string, arg?: Uint8Array, sender?: Principal): Promise<void>;
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
    reinstallCode(canisterId: Principal, wasm: Uint8Array | string, arg?: Uint8Array, sender?: Principal): Promise<void>;
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
    upgradeCanister(canisterId: Principal, wasm: Uint8Array | string, arg?: Uint8Array, sender?: Principal): Promise<void>;
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
    createActor<T = ActorInterface>(interfaceFactory: IDL.InterfaceFactory, canisterId: Principal): Actor<T>;
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
    tearDown(): Promise<void>;
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
    tick(): Promise<void>;
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
    getTime(): Promise<number>;
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
    resetTime(): Promise<void>;
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
    setTime(time: number): Promise<void>;
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
    advanceTime(duration: number): Promise<void>;
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
    fetchRootKey(): Promise<Uint8Array>;
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
    checkCanisterExists(canisterId: Principal): Promise<boolean>;
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
    getCyclesBalance(canisterId: Principal): Promise<number>;
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
    addCycles(canisterId: Principal, amount: number): Promise<number>;
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
    setStableMemory(canisterId: Principal, stableMemory: Uint8Array): Promise<void>;
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
    getStableMemory(canisterId: Principal): Promise<Uint8Array>;
}
