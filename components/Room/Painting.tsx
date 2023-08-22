import React from "react";
import { BoxGeometry, MeshStandardMaterial, PlaneGeometry, TextureLoader, Vector3 } from "three";
import { MeshReflectorMaterial } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";

const frameMaterial = new MeshStandardMaterial({ color: "#000" });
const frameGeometry = new BoxGeometry(0.04, 0.04, 1.04);

const paintingGeometry = new PlaneGeometry(1, 1);

export function Painting({
  position,
  rotation,
  imageUrl,
}: {
  position: [x: number, y: number, z: number];
  rotation: [x: number, y: number, z: number];
  imageUrl?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh
        geometry={frameGeometry}
        material={frameMaterial}
        position={[0, -0.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <mesh
        geometry={frameGeometry}
        material={frameMaterial}
        position={[0, 0.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />

      <mesh
        geometry={frameGeometry}
        material={frameMaterial}
        position={[-0.5, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={frameGeometry}
        material={frameMaterial}
        position={[0.5, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh geometry={paintingGeometry}>
        {imageUrl ? (
          <PaintingMesh imageUrl={imageUrl} />
        ) : (
          <MeshReflectorMaterial mirror={0.95} resolution={1024} />
        )}
      </mesh>
    </group>
  );
}

export function PaintingMesh({ imageUrl }: { imageUrl: string }) {
  const paintingTexture = useLoader(TextureLoader, imageUrl);
  return <meshStandardMaterial map={paintingTexture} />;
}
