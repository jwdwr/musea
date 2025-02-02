"use client";

import React, { useRef } from "react";
import { BoxGeometry, Group, MeshStandardMaterial, PlaneGeometry } from "three";
import { Room } from "../../lib/shared/museum/room";
import { Direction } from "../../lib/shared/museum/directions";
import { RoomWall } from "./RoomWall";
import { RigidBody } from "@react-three/rapier";

// Share materials and geometries across all rooms
const floorMaterial = new MeshStandardMaterial({ color: "#aaccff" });

export function RoomComponent({ room, withCeiling = true }: { room: Room; withCeiling?: boolean }) {
  const roomRef = useRef<Group>(null);
  const roomPosition: [number, number, number] = [room.location.x * 2.1, 0, room.location.y * 2.1];

  // Calculate room dimensions
  let roomWidth = 1;
  let roomHeight = 1;

  // Calculate width by checking for missing west walls
  while (room.location.x + roomWidth < room.size.width && !room.walls[Direction.East]) {
    roomWidth++;
  }

  // Calculate height by checking for missing north walls
  while (room.location.y + roomHeight < room.size.height && !room.walls[Direction.South]) {
    roomHeight++;
  }

  // Create geometries based on room size
  const floorGeometry = new PlaneGeometry(2.2 * roomWidth, 2.2 * roomHeight);
  const ceilingGeometry = new BoxGeometry(2.2 * roomWidth, 0.1, 2.2 * roomHeight);

  const floorPosition: [number, number, number] = [
    (roomWidth - 1) * 1.05,
    -1,
    (roomHeight - 1) * 1.05,
  ];
  const floorRotation: [number, number, number] = [-Math.PI / 2, 0, 0];
  const ceilingPosition: [number, number, number] = [
    (roomWidth - 1) * 1.05,
    1.05,
    (roomHeight - 1) * 1.05,
  ];

  return (
    <group ref={roomRef} position={roomPosition}>
      <mesh
        position={floorPosition}
        rotation={floorRotation}
        geometry={floorGeometry}
        material={floorMaterial}
      />

      {withCeiling && (
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={ceilingPosition} geometry={ceilingGeometry} material={floorMaterial} />
        </RigidBody>
      )}

      {room.walls[Direction.North] && (
        <RoomWall wall={room.walls[Direction.North]} width={roomWidth} />
      )}
      {room.walls[Direction.South] && (
        <RoomWall wall={room.walls[Direction.South]} width={roomWidth} />
      )}
      {room.walls[Direction.East] && (
        <RoomWall wall={room.walls[Direction.East]} width={roomHeight} />
      )}
      {room.walls[Direction.West] && (
        <RoomWall wall={room.walls[Direction.West]} width={roomHeight} />
      )}
    </group>
  );
}
