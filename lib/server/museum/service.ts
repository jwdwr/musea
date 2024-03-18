import { KVNamespace, R2Bucket } from "@cloudflare/workers-types";
import { KVStore } from "../store/kv";
import { Store } from "../store";
import { Bucket } from "../bucket";
import { CFBucket } from "../bucket/cf";
import { LocalBucket } from "../bucket/local";
import { MuseumGenerator } from "./generator";
import { simpleStore } from "../store/simple";
import dayjs from "dayjs";
import { MuseumGeneration } from "@/lib/shared/types";

export class MuseumService {
  private generator: MuseumGenerator;
  constructor() {
    const date = dayjs().format("YYYY-MM-DD-HH");
    const imageBucket = process.env.IMAGES as R2Bucket | undefined;
    const mapsKv = process.env.MAPS as KVNamespace | undefined;
    const store: Store = mapsKv ? new KVStore(mapsKv) : simpleStore;
    const bucket: Bucket = imageBucket
      ? new CFBucket(imageBucket, process.env.IMAGES_HOST!)
      : new LocalBucket(process.env.IMAGES_HOST!);

    this.generator = new MuseumGenerator(bucket, store, date);
  }

  async viewMuseum(): Promise<MuseumGeneration | undefined> {
    return this.generator.load();
  }

  async newMuseum(): Promise<MuseumGeneration> {
    return this.generator.generateMuseum();
  }
}

export const museumService = new MuseumService();
