import React from "react";
import { Museum as MuseumComponent } from "../components/Museum";
import { World } from "../components/World";
import { MuseumGeneration } from "@/lib/shared/types";
import { redirect } from "next/navigation";

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

async function getMuseum(): Promise<MuseumGeneration> {
  const res = await fetch("http://localhost:3000/api/museum/view");
  return res.json();
}
