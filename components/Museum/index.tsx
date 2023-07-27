import React from "react";
import {
  KeyboardControls,
  MeshReflectorMaterial,
  PointerLockControls,
  Stars,
} from "@react-three/drei";
import { Layout } from "../../lib/shared/museum/layout";
import { RoomComponent } from "../Room";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { Player } from "../Player";

export function Museum({ width, length }: { width: number; length: number }) {
  const layout = Layout.generateLayout(width, length);
  console.log(layout);
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
      ]}
    >
      <PointerLockControls />
      <ambientLight intensity={0.1} />
      <Physics gravity={[0, -9.81, 0]}>
        <Player />
        {layout.listRooms().map((room) => (
          <RoomComponent key={`${room.location.x}-${room.location.y}`} room={room} />
        ))}
        <Stars />
        <RigidBody type="fixed" colliders={false}>
          <mesh receiveShadow position={[0, -1.05, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[1000, 1000]} />
            <MeshReflectorMaterial mirror={0.5} resolution={1024} />
          </mesh>
          <CuboidCollider args={[1000, 1, 1000]} position={[0, -1, 0]} />
        </RigidBody>
      </Physics>
    </KeyboardControls>
  );
}
