import { museumService } from "@/lib/server/museum/service";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(await museumService.viewMuseum());
}
