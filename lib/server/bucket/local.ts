import type { Bucket } from ".";

import { dirname } from "path";
import { cwd } from "process";

export class LocalBucket implements Bucket {
  constructor(private bucketDirectory: string) {}

  async put(key: string, value: Buffer): Promise<string> {
    const { mkdir, writeFile } = await import("fs/promises");
    const parentDirectory = `${cwd()}/public/${this.bucketDirectory}`;
    await mkdir(`${parentDirectory}/${dirname(key)}`, {
      recursive: true,
    });
    const filename = `${parentDirectory}/${key}`;
    await writeFile(filename, value);
    return `${this.bucketDirectory}/${key}`;
  }

  async get(key: string): Promise<Buffer | null> {
    try {
      const { readFile } = await import("fs/promises");
      return await readFile(`${this.bucketDirectory}/${key}`);
    } catch (_) {
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    const { rm } = await import("fs/promises");
    await rm(`${this.bucketDirectory}/${key}`);
  }
}
