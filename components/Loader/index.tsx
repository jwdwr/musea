"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MuseumGeneration } from "@/lib/shared/types";
import { redirect } from "next/navigation";
import { Museum } from "../Museum";
import { World } from "../World";

export function MuseumLoader({
  initialGeneration,
}: {
  initialGeneration: MuseumGeneration | undefined;
}) {
  const [generation, setGeneration] = useState(initialGeneration);

  const checkMuseum = useCallback(async () => {
    const res = await fetch("/api/museum/view");
    setGeneration(await res.json());
  }, [setGeneration]);

  const newMuseum = useCallback(async () => {
    const res = await fetch("/api/museum/new");
    setGeneration(await res.json());
  }, [setGeneration]);

  useEffect(() => {
    if (!generation?.status) {
      newMuseum();
    } else if (generation?.status === "generated") {
      return;
    } else {
      setTimeout(() => checkMuseum(), 1000);
    }
  }, [checkMuseum, newMuseum, generation]);

  return generation?.status === "generated" ? (
    <World>
      <Museum museum={generation.museum} />
    </World>
  ) : (
    <div>Loading...</div>
  );
}
