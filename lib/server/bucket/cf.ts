import type { R2Bucket } from "@cloudflare/workers-types";
import type { Bucket } from ".";

export class CFBucket implements Bucket {
  constructor(private bucket: R2Bucket, private baseUrl: string) {}

  async get(key: string): Promise<Buffer | null> {
    const response = await this.bucket.get(key);
    return response ? Buffer.from(await response.arrayBuffer()) : null;
  }

  async put(key: string, value: Buffer): Promise<string> {
    await this.bucket.put(key, value);
    return `${this.baseUrl}/${key}`;
  }

  async delete(key: string): Promise<void> {
    await this.bucket.delete(key);
  }
}
