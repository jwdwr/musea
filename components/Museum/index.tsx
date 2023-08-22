"use client";

import React, { useMemo } from "react";
import { RoomComponent } from "../Room";
import { Museum } from "@/lib/shared/types";
import { Room } from "@/lib/shared/museum/room";

export function Museum({ museum }: { museum: Museum }) {
  console.log(museum);
  const rooms = useMemo(() => museum.grid.flat().filter((room) => room) as Room[], [museum]);
  return rooms.map((room) => (
    <RoomComponent key={`${room.location.x}-${room.location.y}`} room={room} />
  ));
}
