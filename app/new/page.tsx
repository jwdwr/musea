import React from "react";
import { MuseumGeneration } from "@/lib/shared/types";
import { redirect } from "next/navigation";
import { MuseumLoader } from "@/components/Loader";
import { Museum } from "@/components/Museum";
import { MuseumService } from "@/lib/server/museum/service";

export default async function NewMuseum() {
  const generation = await getMuseum();

  if (generation?.status === "generated") {
    return <Museum museum={generation.museum} />;
  }

  return <MuseumLoader initialGeneration={generation} />;
}

async function getMuseum(): Promise<MuseumGeneration | undefined> {
  return new MuseumService().viewMuseum();
}
