import React, { useMemo } from "react";
import { BoxGeometry, MeshStandardMaterial } from "three";
import { RigidBody } from "@react-three/rapier";
import { Direction } from "@/lib/shared/museum/directions";
import { Painting } from "./Painting";
import { DoorWall } from "./DoorWall";
import { Wall } from "@/lib/shared/types";

// Share materials and geometries across all instances
const wallMaterial = new MeshStandardMaterial({ color: "#666" });
const fullWallGeometry = new BoxGeometry(0.1, 2, 2.2);

export function RoomWall({ wall }: { wall: Wall }) {
  const { direction } = wall;

  // Memoize transforms to avoid recalculation
  const transforms = useMemo(() => {
    const wallPosition: [number, number, number] = (() => {
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
    })();

    const wallRotation: [number, number, number] = (() => {
      switch (direction) {
        case Direction.North:
        case Direction.South:
          return [0, Math.PI / 2, 0];
        case Direction.East:
        case Direction.West:
          return [0, 0, 0];
      }
    })();

    const paintingPosition: [number, number, number] = (() => {
      switch (direction) {
        case Direction.South:
        case Direction.West:
          return [0.1, 0.1, 0];
        case Direction.North:
        case Direction.East:
          return [-0.1, 0.1, 0];
      }
    })();

    const paintingRotation: [number, number, number] = (() => {
      switch (direction) {
        case Direction.South:
        case Direction.West:
          return [0, Math.PI / 2, 0];
        case Direction.North:
        case Direction.East:
          return [0, -Math.PI / 2, 0];
      }
    })();

    return { wallPosition, wallRotation, paintingPosition, paintingRotation };
  }, [direction]);

  if (wall.hasDoor) {
    return (
      <DoorWall wall={wall} position={transforms.wallPosition} rotation={transforms.wallRotation} />
    );
  }

  return (
    <group position={transforms.wallPosition} rotation={transforms.wallRotation}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh geometry={fullWallGeometry} material={wallMaterial} />
      </RigidBody>

      {wall.paintingUrl && (
        <Painting
          position={transforms.paintingPosition}
          rotation={transforms.paintingRotation}
          imageUrl={wall.paintingUrl}
        />
      )}
    </group>
  );
}
