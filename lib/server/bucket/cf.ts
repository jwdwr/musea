import type { R2Bucket } from "@cloudflare/workers-types";
import type { Bucket } from ".";

export class CFBucket implements Bucket {
  constructor(private bucket: R2Bucket, private baseUrl: string) {}

  async get(key: string): Promise<Buffer | null> {
    try {
      const response = await this.bucket.get(key);
      return response ? Buffer.from(await response.arrayBuffer()) : null;
    } catch (e) {
      console.error("Failed to get file", e);
      return null;
    }
  }

  async put(key: string, value: Buffer): Promise<string> {
    try {
      const result = await this.bucket.put(key, value);
      console.log(result);
      return `${this.baseUrl}/${key}`;
    } catch (e) {
      console.error("Failed to put file", e);
      return "";
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.bucket.delete(key);
    } catch (e) {
      console.error("Failed to delete file", e);
    }
  }
}
