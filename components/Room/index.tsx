import React, { useRef } from "react";
import { BoxGeometry, Group, MeshStandardMaterial, PlaneGeometry } from "three";
import { Room } from "../../lib/shared/museum/room";
import { Direction } from "../../lib/shared/museum/directions";
import { RoomWall } from "./RoomWall";
import { RigidBody } from "@react-three/rapier";

// Share materials and geometries across all rooms
const floorMaterial = new MeshStandardMaterial({ color: "#aaccff" });
const floorGeometry = new PlaneGeometry(2.2, 2.2);
const ceilingGeometry = new BoxGeometry(2.2, 0.1, 2.2);

// Precompute common transforms
const floorPosition: [number, number, number] = [0, -1, 0];
const floorRotation: [number, number, number] = [-Math.PI / 2, 0, 0];
const ceilingPosition: [number, number, number] = [0, 1.05, 0];

export function RoomComponent({ room, withCeiling = true }: { room: Room; withCeiling?: boolean }) {
  const roomRef = useRef<Group>(null);
  const roomPosition: [number, number, number] = [room.location.x * 2.1, 0, room.location.y * 2.1];

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

      {room.walls[Direction.North] && <RoomWall wall={room.walls[Direction.North]} />}
      {room.walls[Direction.South] && <RoomWall wall={room.walls[Direction.South]} />}
      {room.walls[Direction.East] && <RoomWall wall={room.walls[Direction.East]} />}
      {room.walls[Direction.West] && <RoomWall wall={room.walls[Direction.West]} />}
    </group>
  );
}
