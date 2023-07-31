import { Bucket } from "@/lib/server/bucket";
import { CFBucket } from "@/lib/server/bucket/cf";
import { TestBucket } from "@/lib/server/bucket/test";
import { MuseumGenerator } from "@/lib/server/museum/generator";
import { Store } from "@/lib/server/store";
import { KVStore } from "@/lib/server/store/kv";
import { TestStore } from "@/lib/server/store/test";
import { KVNamespace, R2Bucket } from "@cloudflare/workers-types";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(): Promise<NextResponse> {
  const date = dayjs().format("YYYY-MM-DD-HH");
  const imageBucket = process.env.IMAGES as R2Bucket | undefined;
  const mapsKv = process.env.MAPS as KVNamespace | undefined;
  const store: Store = mapsKv ? new KVStore(mapsKv) : new TestStore();
  const bucket: Bucket = imageBucket ? new CFBucket(imageBucket) : new TestBucket();

  const maker = new MuseumGenerator(bucket, store, date);
  const museum = await maker.generateMuseum();

  return NextResponse.json(museum);
}
