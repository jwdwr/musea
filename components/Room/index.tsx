import React, { useRef } from "react";
import { BoxGeometry, Group, MeshStandardMaterial, PlaneGeometry } from "three";
import { Room } from "../../lib/shared/museum/room";
import { Direction } from "../../lib/shared/museum/directions";
import { RoomWall } from "./RoomWall";
import { RigidBody } from "@react-three/rapier";

const floorMaterial = new MeshStandardMaterial({ color: "#aaccff" });
const floorGeometry = new PlaneGeometry(2.2, 2.2);
const ceilingGeometry = new BoxGeometry(2.2, 0.1, 2.2);

export function RoomComponent({ room, withCeiling = true }: { room: Room; withCeiling?: boolean }) {
  const roomRef = useRef<Group>(null);

  return (
    <>
      <group ref={roomRef} position={[room.location.x * 2.1, 0, room.location.y * 2.1]}>
        <mesh
          position={[0, -1, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={floorGeometry}
          material={floorMaterial}
        />
        {withCeiling && (
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, 1.05, 0]} geometry={ceilingGeometry} material={floorMaterial} />
          </RigidBody>
        )}
        {room.walls[Direction.North] && <RoomWall wall={room.walls[Direction.North]} />}
        {room.walls[Direction.South] && <RoomWall wall={room.walls[Direction.South]} />}
        {room.walls[Direction.East] && <RoomWall wall={room.walls[Direction.East]} />}
        {room.walls[Direction.West] && <RoomWall wall={room.walls[Direction.West]} />}
      </group>
    </>
  );
}
