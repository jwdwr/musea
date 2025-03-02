import React, { useMemo } from "react";
import { BoxGeometry, Vector2 } from "three";
import { RigidBody } from "@react-three/rapier";
import { Wall } from "@/lib/shared/types";
import { TexturedMaterial } from "./TexturedMaterial";

interface WindowWallProps {
  wall: Wall;
  position: [number, number, number];
  rotation: [number, number, number];
  width?: number;
}

export function WindowWall({ wall, position, rotation, width = 1 }: WindowWallProps) {
  // Create geometries based on width
  const geometries = useMemo(() => {
    const totalWidth = 2.2 * width;
    const windowWidth = 1.0;
    const windowHeight = 0.8;
    const sideWidth = (totalWidth - windowWidth) / 2;
    const frameThickness = 0.05;

    return {
      sideWallSegment: new BoxGeometry(0.1, 2, sideWidth),
      topWallSegment: new BoxGeometry(0.1, (2 - windowHeight) / 2, windowWidth),
      bottomWallSegment: new BoxGeometry(0.1, (2 - windowHeight) / 2, windowWidth),
      // Window frame components
      leftFrame: new BoxGeometry(frameThickness, windowHeight, frameThickness),
      rightFrame: new BoxGeometry(frameThickness, windowHeight, frameThickness),
      topFrame: new BoxGeometry(frameThickness, frameThickness, windowWidth),
      bottomFrame: new BoxGeometry(frameThickness, frameThickness, windowWidth),
      // Window glass
      windowGlass: new BoxGeometry(0.02, windowHeight - 0.1, windowWidth - 0.1),
    };
  }, [width]);

  // Calculate positions based on width
  const positions = useMemo(() => {
    const totalWidth = 2.2 * width;
    const windowWidth = 1.0;
    const windowHeight = 0.8;
    const sideWidth = (totalWidth - windowWidth) / 2;
    const frameThickness = 0.05;

    return {
      leftSegment: [0, 0, -(windowWidth / 2 + sideWidth / 2)] as [number, number, number],
      rightSegment: [0, 0, windowWidth / 2 + sideWidth / 2] as [number, number, number],
      // Fix the top and bottom segment positions
      topSegment: [0, windowHeight / 2 + (2 - windowHeight) / 4, 0] as [number, number, number],
      bottomSegment: [0, -windowHeight / 2 - (2 - windowHeight) / 4, 0] as [number, number, number],
      // Window frame positions
      leftFrame: [0.03, 0, -windowWidth / 2 + frameThickness / 2] as [number, number, number],
      rightFrame: [0.03, 0, windowWidth / 2 - frameThickness / 2] as [number, number, number],
      topFrame: [0.03, windowHeight / 2 - frameThickness / 2, 0] as [number, number, number],
      bottomFrame: [0.03, -windowHeight / 2 + frameThickness / 2, 0] as [number, number, number],
      // Window glass
      windowGlass: [0.06, 0, 0] as [number, number, number],
    };
  }, [width]);

  // Calculate texture repeat to ensure proper scaling
  const textureRepeat = useMemo(() => {
    const totalWidth = 2.2 * width;
    const windowWidth = 1.0;
    const sideWidth = (totalWidth - windowWidth) / 2;

    return {
      side: new Vector2(sideWidth / 2, 1),
      topBottom: new Vector2(windowWidth / 2, 0.25),
    };
  }, [width]);

  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders="cuboid">
        <group>
          {/* Wall segments */}
          <mesh geometry={geometries.sideWallSegment} position={positions.leftSegment}>
            <TexturedMaterial
              maps={wall.materials?.walls || {}}
              color="#666"
              repeat={textureRepeat.side}
            />
          </mesh>
          <mesh geometry={geometries.sideWallSegment} position={positions.rightSegment}>
            <TexturedMaterial
              maps={wall.materials?.walls || {}}
              color="#666"
              repeat={textureRepeat.side}
            />
          </mesh>
          <mesh geometry={geometries.topWallSegment} position={positions.topSegment}>
            <TexturedMaterial
              maps={wall.materials?.walls || {}}
              color="#666"
              repeat={textureRepeat.topBottom}
            />
          </mesh>
          <mesh geometry={geometries.bottomWallSegment} position={positions.bottomSegment}>
            <TexturedMaterial
              maps={wall.materials?.walls || {}}
              color="#666"
              repeat={textureRepeat.topBottom}
            />
          </mesh>

          {/* Window frame */}
          <mesh geometry={geometries.leftFrame} position={positions.leftFrame}>
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh geometry={geometries.rightFrame} position={positions.rightFrame}>
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh geometry={geometries.topFrame} position={positions.topFrame}>
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh geometry={geometries.bottomFrame} position={positions.bottomFrame}>
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </group>
      </RigidBody>

      {/* Window glass with transparency */}
      <mesh geometry={geometries.windowGlass} position={positions.windowGlass}>
        <meshPhysicalMaterial
          color="#a5f0ff"
          transparent={true}
          opacity={0.2}
          roughness={0.05}
          transmission={0.95}
          thickness={0.02}
          ior={1.5}
        />
      </mesh>
    </group>
  );
}
