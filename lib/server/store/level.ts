import type { Store } from ".";
import { Level } from "level";

export class LevelStore implements Store {
  private store: Level;

  constructor() {
    this.store = new Level(":memory:");
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    this.store.put(key, value);
  }

  async delete(key: string): Promise<void> {
    this.store.del(key);
  }
}
