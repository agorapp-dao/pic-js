"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFetchError = exports.HttpClient = exports.JSON_HEADER = void 0;
exports.JSON_HEADER = {
    'Content-Type': 'application/json',
};
class HttpClient {
    constructor() { }
    static async get(url, options) {
        const headers = options?.headers ?? {};
        const response = await fetch(url, {
            method: 'GET',
            headers: { ...headers, ...exports.JSON_HEADER },
        });
        await handleFetchError(response);
        return (await response.json());
    }
    static async post(url, options) {
        const body = options?.body ? JSON.stringify(options.body) : null;
        const headers = options?.headers ?? {};
        const response = await fetch(url, {
            method: 'POST',
            body,
            headers: { ...headers, ...exports.JSON_HEADER },
        });
        await handleFetchError(response);
        return (await response.json());
    }
}
exports.HttpClient = HttpClient;
async function handleFetchError(response) {
    if (!response.ok) {
        console.error('Error response', response.url, response.statusText);
        try {
            const body = await response.text();
            console.error(body);
        }
        catch (_) {
            // do nothing
        }
        throw new Error(`${response.url} ${response.statusText}`);
    }
}
exports.handleFetchError = handleFetchError;
//# sourceMappingURL=http-client.js.map