"use client";

import React from "react";
import {
  KeyboardControls,
  MeshReflectorMaterial,
  PointerLockControls,
  Stars,
} from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { Player } from "../Player";
import { Canvas } from "@react-three/fiber";

export function World({ children }: { children?: React.ReactNode }) {
  return (
    <Canvas id="Viewer">
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
          {children}
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
    </Canvas>
  );
}
