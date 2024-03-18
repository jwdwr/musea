import { museumService } from "@/lib/server/museum/service";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(museumService.viewMuseum());
}
