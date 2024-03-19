"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MuseumGeneration } from "@/lib/shared/types";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import "./loader.css";

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
      return redirect("/");
    } else {
      setTimeout(() => checkMuseum(), 1000);
    }
  }, [checkMuseum, newMuseum, generation]);

  const date = useMemo(() => dayjs().format("MMMM D, YYYY"), []);
  const time = useMemo(() => dayjs().format("ha"), []);

  return (
    <div className="page">
      <div className="loading">
        <h1 className="title">
          <strong>musea</strong>: hourly museum generator
        </h1>
        <p className="message">
          the {time} museum for {date} is under construction. please wait a moment.
        </p>
        <div className="loader" />
      </div>
    </div>
  );
}
