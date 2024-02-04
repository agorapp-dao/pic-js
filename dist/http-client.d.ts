/// <reference types="node" />
export type HeadersInit = Record<string, string>;
export interface GetOptions {
    headers?: HeadersInit;
}
export interface PostOptions<P> {
    body?: P;
    headers?: HeadersInit;
}
export declare const JSON_HEADER: HeadersInit;
export declare class HttpClient {
    private constructor();
    static get<R>(url: string, options?: GetOptions): Promise<R>;
    static post<P, R>(url: string, options?: PostOptions<P>): Promise<R>;
}
export declare function handleFetchError(response: Response): Promise<void>;
