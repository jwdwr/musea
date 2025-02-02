import React, { useMemo } from "react";
import { BoxGeometry, MeshStandardMaterial } from "three";
import { RigidBody } from "@react-three/rapier";
import { Direction } from "@/lib/shared/museum/directions";
import { Painting } from "./Painting";
import { DoorWall } from "./DoorWall";
import { Wall } from "@/lib/shared/types";

// Share materials and geometries across all instances
const wallMaterial = new MeshStandardMaterial({ color: "#666" });

export function RoomWall({ wall, width = 1 }: { wall: Wall; width?: number }) {
  const { direction } = wall;

  // Create wall geometry based on width
  const fullWallGeometry = useMemo(() => {
    return new BoxGeometry(0.1, 2, 2.2 * width);
  }, [width]);

  // Memoize transforms to avoid recalculation
  const transforms = useMemo(() => {
    const wallPosition: [number, number, number] = (() => {
      switch (direction) {
        case Direction.North:
          return [(width - 1) * 1.05, 0, -1.05];
        case Direction.South:
          return [(width - 1) * 1.05, 0, 1.05];
        case Direction.East:
          return [1.05, 0, (width - 1) * 1.05];
        case Direction.West:
          return [-1.05, 0, (width - 1) * 1.05];
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
  }, [direction, width]);

  if (wall.hasDoor) {
    return (
      <DoorWall
        wall={wall}
        position={transforms.wallPosition}
        rotation={transforms.wallRotation}
        width={width}
      />
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
