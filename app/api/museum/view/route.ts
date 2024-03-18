import { Bucket } from "@/lib/server/bucket";
import { CFBucket } from "@/lib/server/bucket/cf";
import { LocalBucket } from "@/lib/server/bucket/local";
import { MuseumGenerator } from "@/lib/server/museum/generator";
import { Store } from "@/lib/server/store";
import { KVStore } from "@/lib/server/store/kv";
import { simpleStore } from "@/lib/server/store/simple";
import { KVNamespace, R2Bucket } from "@cloudflare/workers-types";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const date = dayjs().format("YYYY-MM-DD-HH");
  const imageBucket = process.env.IMAGES as R2Bucket | undefined;
  const mapsKv = process.env.MAPS as KVNamespace | undefined;
  const store: Store = mapsKv ? new KVStore(mapsKv) : simpleStore;
  const bucket: Bucket = imageBucket
    ? new CFBucket(imageBucket, process.env.IMAGES_HOST!)
    : new LocalBucket(process.env.IMAGES_HOST!);

  const generator = new MuseumGenerator(bucket, store, date);
  const generation = await generator.load();

  return NextResponse.json(generation);
}
