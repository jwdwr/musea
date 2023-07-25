import React, { useRef } from "react";
import { BoxGeometry, Group, MeshStandardMaterial, PlaneGeometry } from "three";
import { Room } from "../../lib/shared/museum/room";
import { Direction } from "../../lib/shared/museum/directions";
import { Html, MeshReflectorMaterial } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { RoomWall } from "./RoomWall";

const floorMaterial = new MeshStandardMaterial({
  color: "#00ff00",
  transparent: false,
  opacity: 0.5,
});
const floorGeometry = new PlaneGeometry(1.2, 1.2);
const ceilingGeometry = new BoxGeometry(1.2, 0.1, 1.2);

export function RoomComponent({ room, withCeiling = true }: { room: Room; withCeiling?: boolean }) {
  const roomRef = useRef<Group>(null);

  return (
    <>
      <group ref={roomRef} position={[room.location.x * 1.1, 0, room.location.y * 1.1]}>
        <mesh
          position={[0, -0.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={floorGeometry}
          material={floorMaterial}
        />
        {withCeiling && (
          <mesh position={[0, 0.55, 0]} geometry={ceilingGeometry} material={floorMaterial} />
        )}
        {room.walls[Direction.North] && <RoomWall direction={Direction.North} />}
        {room.walls[Direction.South] && <RoomWall direction={Direction.South} />}
        {room.walls[Direction.East] && <RoomWall direction={Direction.East} />}
        {room.walls[Direction.West] && <RoomWall direction={Direction.West} />}
      </group>
    </>
  );
}
