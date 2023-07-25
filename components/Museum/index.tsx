import React from "react";
import { FlyControls, KeyboardControls, PointerLockControls } from "@react-three/drei";
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
      <directionalLight position={[2, 3, 2]} />
      <ambientLight intensity={0.5} />
      <Physics gravity={[0, -9.81, 0]}>
        <Player />
        {layout.listRooms().map((room) => (
          <RoomComponent key={`${room.location.x}-${room.location.y}`} room={room} />
        ))}

        <RigidBody type="fixed" colliders={false}>
          <mesh receiveShadow position={[0, -0.6, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial />
          </mesh>
          <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
        </RigidBody>
      </Physics>
    </KeyboardControls>
  );
}
