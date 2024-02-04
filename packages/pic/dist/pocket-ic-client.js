"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PocketIcClient = void 0;
const util_1 = require("./util");
const http_client_1 = require("./http-client");
const PROCESSING_TIME_HEADER = 'processing-timeout-ms';
const PROCESSING_TIME_VALUE_MS = 300_000;
const PROCESSING_HEADER = {
    [PROCESSING_TIME_HEADER]: PROCESSING_TIME_VALUE_MS.toString(),
};
class PocketIcClient {
    instanceUrl;
    serverUrl;
    constructor(instanceUrl, serverUrl) {
        this.instanceUrl = instanceUrl;
        this.serverUrl = serverUrl;
    }
    static async create(url) {
        const instanceId = await PocketIcClient.createInstance(url);
        return new PocketIcClient(`${url}/instances/${instanceId}`, url);
    }
    static async createInstance(url) {
        const response = await http_client_1.HttpClient.post(`${url}/instances`, {
            body: {
                nns: false,
                sns: false,
                ii: false,
                fiduciary: false,
                bitcoin: false,
                system: 0,
                application: 1
            }
        });
        if ('Error' in response) {
            throw new Error(response.Error.message);
        }
        return response.Created.instance_id;
    }
    async deleteInstance() {
        await fetch(this.instanceUrl, {
            method: 'DELETE',
        });
    }
    async tick() {
        return await this.post('/update/tick');
    }
    async getTime() {
        const response = await this.get('/read/get_time');
        return response.nanos_since_epoch / 1_000_000;
    }
    async setTime(time) {
        await this.post('/update/set_time', {
            nanos_since_epoch: time * 1_000_000,
        });
    }
    async fetchRootKey() {
        return await this.post('/read/root_key');
    }
    async checkCanisterExists(canisterId) {
        return await this.post('/read/canister_exists', { canister_id: (0, util_1.base64EncodePrincipal)(canisterId) });
    }
    async getCyclesBalance(canisterId) {
        const response = await this.post('/read/get_cycles', {
            canister_id: (0, util_1.base64EncodePrincipal)(canisterId),
        });
        return response.cycles;
    }
    async addCycles(canisterId, amount) {
        const response = await this.post('/update/add_cycles', {
            canister_id: (0, util_1.base64EncodePrincipal)(canisterId),
            amount,
        });
        return response.cycles;
    }
    async uploadBlob(blob) {
        const response = await fetch(`${this.serverUrl}/blobstore`, {
            method: 'POST',
            body: blob,
        });
        const responseText = await response.text();
        return new Uint8Array((0, util_1.hexDecode)(responseText));
    }
    async setStableMemory(canisterId, blobId) {
        const request = {
            canister_id: (0, util_1.base64EncodePrincipal)(canisterId),
            blob_id: Array.from(blobId),
        };
        const response = await fetch(`${this.instanceUrl}/update/set_stable_memory`, {
            method: 'POST',
            headers: {
                ...http_client_1.JSON_HEADER,
                ...PROCESSING_HEADER,
            },
            body: JSON.stringify(request),
        });
        await (0, http_client_1.handleFetchError)(response);
    }
    async getStableMemory(canisterId) {
        const response = await this.post('/read/get_stable_memory', {
            canister_id: (0, util_1.base64EncodePrincipal)(canisterId),
        });
        return (0, util_1.base64Decode)(response.blob);
    }
    async updateCall(canisterId, sender, method, payload) {
        return await this.canisterCall('/update/execute_ingress_message', canisterId, sender, method, payload);
    }
    async queryCall(canisterId, sender, method, payload) {
        return await this.canisterCall('/read/query', canisterId, sender, method, payload);
    }
    async canisterCall(endpoint, canisterId, sender, method, payload) {
        let rawCanisterCall = {
            sender: (0, util_1.base64EncodePrincipal)(sender),
            effective_principal: 'None',
            canister_id: (0, util_1.base64EncodePrincipal)(canisterId),
            method,
            payload: (0, util_1.base64Encode)(payload),
        };
        const response = await this.post(endpoint, rawCanisterCall);
        if ('Err' in response) {
            throw new Error(response.Err.description);
        }
        return (0, util_1.base64Decode)(response.Ok.Reply);
    }
    async post(endpoint, body) {
        return await http_client_1.HttpClient.post(`${this.instanceUrl}${endpoint}`, {
            body,
            headers: PROCESSING_HEADER,
        });
    }
    async get(endpoint) {
        return await http_client_1.HttpClient.get(`${this.instanceUrl}${endpoint}`, {
            headers: PROCESSING_HEADER,
        });
    }
}
exports.PocketIcClient = PocketIcClient;
//# sourceMappingURL=pocket-ic-client.js.map