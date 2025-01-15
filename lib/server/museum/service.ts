import { KVNamespace, R2Bucket } from "@cloudflare/workers-types";
import { KVStore } from "../store/kv";
import { Store } from "../store";
import { Bucket } from "../bucket";
import { CFBucket } from "../bucket/cf";
import { MuseumGenerator } from "./generator";
import { simpleStore } from "../store/simple";
import dayjs from "dayjs";
import { MuseumGeneration } from "@/lib/shared/types";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { TestBucket } from "../bucket/test";

export class MuseumService {
  private generator: MuseumGenerator;
  constructor() {
    const date = dayjs().format("YYYY-MM-DD-HH");
    console.log("Using date", date);
    let store: Store;
    let bucket: Bucket;

    // Initialize store and bucket first
    try {
      const imageBucket = getRequestContext().env.IMAGES as R2Bucket;
      const mapsKv = getRequestContext().env.MAPS as KVNamespace;
      if (!imageBucket || !mapsKv) throw new Error("Required Cloudflare services not available");

      store = new KVStore(mapsKv);
      bucket = new CFBucket(imageBucket, process.env.IMAGES_HOST!);
    } catch (e) {
      console.log("Using local fallback services");
      store = simpleStore;
      bucket = new TestBucket("/images");
    }

    // Create generator only after store and bucket are definitely initialized
    this.generator = new MuseumGenerator(bucket, store, date);
  }

  async viewMuseum(): Promise<MuseumGeneration | undefined> {
    return this.generator.load();
  }

  async newMuseum(): Promise<MuseumGeneration> {
    return this.generator.generateMuseum();
  }
}
