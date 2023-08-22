import React, { useMemo } from "react";
import { BoxGeometry, MeshStandardMaterial, PlaneGeometry, Vector3 } from "three";
import { RigidBody } from "@react-three/rapier";
import { Direction } from "@/lib/shared/museum/directions";
import { Painting } from "./Painting";
import { Wall } from "@/lib/shared/types";

const wallMaterial = new MeshStandardMaterial({ color: "#666" });
const wallGeometry = new BoxGeometry(0.1, 2, 2.2);

export function RoomWall({ wall }: { wall: Wall }) {
  const { direction } = wall;

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

  const paintingPosition: [x: number, y: number, z: number] = useMemo(() => {
    switch (direction) {
      case Direction.South:
      case Direction.West:
        return [0.1, 0.1, 0];
      case Direction.North:
      case Direction.East:
        return [-0.1, 0.1, 0];
    }
  }, [direction]);

  const paintingRotation: [x: number, y: number, z: number] = useMemo(() => {
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

      <Painting
        position={paintingPosition}
        rotation={paintingRotation}
        imageUrl={wall.paintingUrl}
      />
    </group>
  );
}
