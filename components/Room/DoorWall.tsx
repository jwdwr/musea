import React from "react";
import { BoxGeometry, MeshStandardMaterial } from "three";
import { RigidBody } from "@react-three/rapier";
import { Wall } from "@/lib/shared/types";

// Share materials and geometries across all instances
const wallMaterial = new MeshStandardMaterial({ color: "#666" });

// Create and share all the geometries we'll need
const geometries = {
  sideWallSegment: new BoxGeometry(0.1, 2, 0.7), // (2.2 - 0.8) / 2 = 0.7
  topWallSegment: new BoxGeometry(0.1, 0.4, 0.8), // 2 - 1.6 = 0.4 height
};

// Precompute common positions
const positions = {
  leftSegment: [0, 0, -0.75] as [number, number, number], // -(0.8/2 + 0.7/2) = -0.75
  rightSegment: [0, 0, 0.75] as [number, number, number], // (0.8/2 + 0.7/2) = 0.75
  topSegment: [0, 0.8, 0] as [number, number, number], // 1.6/2 = 0.8
};

interface DoorWallProps {
  wall: Wall;
  position: [number, number, number];
  rotation: [number, number, number];
}

export function DoorWall({ wall, position, rotation }: DoorWallProps) {
  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders="cuboid">
        <group>
          <mesh
            geometry={geometries.sideWallSegment}
            material={wallMaterial}
            position={positions.leftSegment}
          />
          <mesh
            geometry={geometries.sideWallSegment}
            material={wallMaterial}
            position={positions.rightSegment}
          />
          <mesh
            geometry={geometries.topWallSegment}
            material={wallMaterial}
            position={positions.topSegment}
          />
        </group>
      </RigidBody>
    </group>
  );
}
