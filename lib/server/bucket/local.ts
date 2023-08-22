import type { Bucket } from ".";
import { writeFile, readFile, rm, mkdir } from "fs/promises";
import { dirname } from "path";
import { cwd } from "process";

export class LocalBucket implements Bucket {
  constructor(private bucketDirectory: string) {}

  async put(key: string, value: Buffer): Promise<string> {
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
      return await readFile(`${this.bucketDirectory}/${key}`);
    } catch (_) {
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    await rm(`${this.bucketDirectory}/${key}`);
  }
}
