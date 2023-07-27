import type { Bucket } from ".";

export class TestBucket implements Bucket {
  private store: Record<string, Buffer> = {};

  async get(key: string): Promise<Buffer | null> {
    return this.store[key] ?? null;
  }

  async put(key: string, value: Buffer): Promise<void> {
    this.store[key] = value;
  }

  async delete(key: string): Promise<void> {
    delete this.store[key];
  }
}
