import React from "react";
import { Museum as MuseumComponent } from "../components/Museum";
import { World } from "../components/World";
import { MuseumGeneration } from "@/lib/shared/types";
import { redirect } from "next/navigation";
import { museumService } from "@/lib/server/museum/service";

export default async function Home() {
  const generation = await getMuseum();

  if (generation?.status !== "generated") {
    redirect("/new");
    return null;
  }

  return (
    <World>
      <MuseumComponent museum={generation.museum} />
    </World>
  );
}

async function getMuseum(): Promise<MuseumGeneration | undefined> {
  return museumService.viewMuseum();
}
