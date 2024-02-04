import { access, constants, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';

export async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

export function tmpFile(filePath: string) {
  return resolve(tmpdir(), filePath);
}

export async function readFileAsBytes(filePath: string): Promise<Uint8Array> {
  const buffer = await readFile(filePath);

  return Uint8Array.from(buffer);
}

export async function readFileAsString(filePath: string): Promise<string> {
  return await readFile(filePath, { encoding: 'utf-8' });
}
