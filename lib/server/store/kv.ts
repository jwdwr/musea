import type { KVNamespace } from "@cloudflare/workers-types";
import type { Store } from ".";

export class KVStore implements Store {
  constructor(private kv: KVNamespace) {}

  async get(key: string): Promise<string | null> {
    return await this.kv.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.kv.put(key, value);
  }

  async delete(key: string): Promise<void> {
    await this.kv.delete(key);
  }
}
