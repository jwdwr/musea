import type { Store } from ".";

export class SimpleStore implements Store {
  private store: Record<string, string>;

  constructor() {
    this.store = {};
  }

  async get(key: string): Promise<string | null> {
    return this.store[key] ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    this.store[key] = value;
  }

  async delete(key: string): Promise<void> {
    delete this.store[key];
  }
}

export const simpleStore = new SimpleStore();
