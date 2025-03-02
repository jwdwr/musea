import { generateBuilding } from "@/lib/shared/museum/building";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const width = parseInt(searchParams.get("width") || "5");
  const height = parseInt(searchParams.get("height") || "5");
  const numFloors = parseInt(searchParams.get("numFloors") || "1");

  const buildingLayout = generateBuilding(width, height, numFloors);

  return NextResponse.json({ buildingLayout });
}
