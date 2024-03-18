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
    try {
      const imageBucket = getRequestContext().env.IMAGES as R2Bucket;
      const mapsKv = getRequestContext().env.MAPS as KVNamespace;
      store = new KVStore(mapsKv);
      bucket = new CFBucket(imageBucket, process.env.IMAGES_HOST!);
    } catch (e) {
      console.error("Failed to initialize Cloudflare services, falling back to local");
      store = simpleStore;
      bucket = new TestBucket("/images");
    }

    this.generator = new MuseumGenerator(bucket, store, date);
  }

  async viewMuseum(): Promise<MuseumGeneration | undefined> {
    return this.generator.load();
  }

  async newMuseum(): Promise<MuseumGeneration> {
    return this.generator.generateMuseum();
  }
}
