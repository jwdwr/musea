import React, { useMemo } from "react";
import { BoxGeometry } from "three";
import { RigidBody } from "@react-three/rapier";
import { Wall } from "@/lib/shared/types";
import { TexturedMaterial } from "./TexturedMaterial";

interface DoorWallProps {
  wall: Wall;
  position: [number, number, number];
  rotation: [number, number, number];
  width?: number;
}

export function DoorWall({ wall, position, rotation, width = 1 }: DoorWallProps) {
  // Create geometries based on width
  const geometries = useMemo(() => {
    const totalWidth = 2.2 * width;
    const doorWidth = 0.8;
    const sideWidth = (totalWidth - doorWidth) / 2;

    return {
      sideWallSegment: new BoxGeometry(0.1, 2, sideWidth),
      topWallSegment: new BoxGeometry(0.1, 0.4, doorWidth),
    };
  }, [width]);

  // Calculate positions based on width
  const positions = useMemo(() => {
    const totalWidth = 2.2 * width;
    const doorWidth = 0.8;
    const sideWidth = (totalWidth - doorWidth) / 2;

    return {
      leftSegment: [0, 0, -(doorWidth / 2 + sideWidth / 2)] as [number, number, number],
      rightSegment: [0, 0, doorWidth / 2 + sideWidth / 2] as [number, number, number],
      topSegment: [0, 0.8, 0] as [number, number, number],
    };
  }, [width]);

  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders="cuboid">
        <group>
          <mesh geometry={geometries.sideWallSegment} position={positions.leftSegment}>
            <TexturedMaterial maps={wall.materials?.walls || {}} color="#666" />
          </mesh>
          <mesh geometry={geometries.sideWallSegment} position={positions.rightSegment}>
            <TexturedMaterial maps={wall.materials?.walls || {}} color="#666" />
          </mesh>
          <mesh geometry={geometries.topWallSegment} position={positions.topSegment}>
            <TexturedMaterial maps={wall.materials?.walls || {}} color="#666" />
          </mesh>
        </group>
      </RigidBody>
    </group>
  );
}
