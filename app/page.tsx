import React from "react";
import { Museum as MuseumComponent } from "../components/Museum";
import { World } from "../components/World";
import { Museum } from "@/lib/shared/types";

export default async function Home() {
  const museum = await getMuseum();
  return (
    <World>
      <MuseumComponent museum={museum} />
    </World>
  );
}

async function getMuseum(): Promise<Museum> {
  const res = await fetch("http://localhost:3000/api/museum", { next: { revalidate: 3600 } });
  return res.json();
}
