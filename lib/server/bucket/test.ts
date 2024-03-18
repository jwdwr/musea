import type { Bucket } from ".";

export class TestBucket implements Bucket {
  constructor(private bucketDirectory: string) {}

  async put(key: string, value: Buffer): Promise<string> {
    return `${this.bucketDirectory}/${key}`;
  }

  async get(key: string): Promise<Buffer | null> {
    return null;
  }

  async delete(key: string): Promise<void> {
    return;
  }
}
