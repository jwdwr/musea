import React, { useMemo, useRef } from "react";
import { BoxGeometry, Group, MeshStandardMaterial, PlaneGeometry, Vector3 } from "three";
import { RigidBody } from "@react-three/rapier";
import { Direction } from "@/lib/shared/museum/directions";
import { MeshReflectorMaterial } from "@react-three/drei";

const wallMaterial = new MeshStandardMaterial({
  color: "#ff0000",
  transparent: false,
  opacity: 0.5,
});
const wallGeometry = new BoxGeometry(0.1, 1, 1.2);
const mirrorGeometry = new PlaneGeometry(0.4, 0.4);

export function RoomWall({ direction }: { direction: Direction }) {
  const position: [x: number, y: number, z: number] = useMemo(() => {
    switch (direction) {
      case Direction.North:
        return [0, 0, -0.55];
      case Direction.South:
        return [0, 0, 0.55];
      case Direction.East:
        return [0.55, 0, 0];
      case Direction.West:
        return [-0.55, 0, 0];
    }
  }, [direction]);

  const rotation: [x: number, y: number, z: number] = useMemo(() => {
    switch (direction) {
      case Direction.North:
      case Direction.South:
        return [0, Math.PI / 2, 0];
      case Direction.East:
      case Direction.West:
        return [0, 0, 0];
    }
  }, [direction]);

  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh geometry={wallGeometry} material={wallMaterial} />
      </RigidBody>

      <mesh position={[0.1, 0.1, 0.1]} geometry={mirrorGeometry} rotation={[0, Math.PI / 2, 0]}>
        <MeshReflectorMaterial mirror={0.95} resolution={1024} />
      </mesh>
    </group>
  );
}
