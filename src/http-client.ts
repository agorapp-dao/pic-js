export type HeadersInit = Record<string, string>;

export interface GetOptions {
  headers?: HeadersInit;
}

export interface PostOptions<P> {
  body?: P;
  headers?: HeadersInit;
}

export const JSON_HEADER: HeadersInit = {
  'Content-Type': 'application/json',
};

export class HttpClient {
  private constructor() {}

  public static async get<R>(url: string, options?: GetOptions): Promise<R> {
    const headers = options?.headers ?? {};

    const response = await fetch(url, {
      method: 'GET',
      headers: { ...headers, ...JSON_HEADER },
    });

    await handleFetchError(response);
    return (await response.json()) as R;
  }

  public static async post<P, R>(
    url: string,
    options?: PostOptions<P>,
  ): Promise<R> {
    const body = options?.body ? JSON.stringify(options.body) : null;
    const headers = options?.headers ?? {};

    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: { ...headers, ...JSON_HEADER },
    });

    await handleFetchError(response);
    return (await response.json()) as R;
  }
}

export async function handleFetchError(response: Response): Promise<void> {
  if (!response.ok) {
    console.error('Error response', response.url, response.statusText);

    try {
      const body = await response.text();
      console.error(body);
    } catch (_) {
      // do nothing
    }

    throw new Error(`${response.url} ${response.statusText}`);
  }
}
