import type { Buffer } from "buffer";

export abstract class Bucket {
  abstract get(key: string): Promise<Buffer | null>;
  abstract put(key: string, value: Buffer): Promise<string>;
  abstract delete(key: string): Promise<void>;
}
