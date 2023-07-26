import React, { useMemo } from "react";
import { BoxGeometry, MeshStandardMaterial, PlaneGeometry, Vector3 } from "three";
import { RigidBody } from "@react-three/rapier";
import { Direction } from "@/lib/shared/museum/directions";
import { Mirror } from "./Mirror";

const wallMaterial = new MeshStandardMaterial({ color: "#666" });
const wallGeometry = new BoxGeometry(0.1, 2, 2.2);
const mirrorGeometry = new PlaneGeometry(1, 1);

export function RoomWall({ direction }: { direction: Direction }) {
  const position: [x: number, y: number, z: number] = useMemo(() => {
    switch (direction) {
      case Direction.North:
        return [0, 0, -1.05];
      case Direction.South:
        return [0, 0, 1.05];
      case Direction.East:
        return [1.05, 0, 0];
      case Direction.West:
        return [-1.05, 0, 0];
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

  const mirrorPosition: [x: number, y: number, z: number] = useMemo(() => {
    switch (direction) {
      case Direction.South:
      case Direction.West:
        return [0.1, 0.1, 0];
      case Direction.North:
      case Direction.East:
        return [-0.1, 0.1, 0];
    }
  }, [direction]);

  const mirrorRotation: [x: number, y: number, z: number] = useMemo(() => {
    switch (direction) {
      case Direction.South:
      case Direction.West:
        return [0, Math.PI / 2, 0];
      case Direction.North:
      case Direction.East:
        return [0, -Math.PI / 2, 0];
    }
  }, [direction]);

  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh geometry={wallGeometry} material={wallMaterial} />
      </RigidBody>

      <Mirror position={mirrorPosition} rotation={mirrorRotation} />
    </group>
  );
}
