import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  PointsMaterial,
  SphereGeometry,
} from "three";

const particlesGeometry = new BufferGeometry();
const count = 500;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (var i = 0; i < count * 3; i += 3) {
  var radius = 0.04;
  var phi = Math.random() * 2.0 * Math.PI;
  var theta = Math.random() * 2.0 * Math.PI;

  positions[i] = radius * Math.sin(theta) * Math.cos(phi);
  positions[i + 1] = radius * Math.sin(theta) * Math.sin(phi);
  positions[i + 2] = radius * Math.cos(theta);

  positions[i] += (Math.random() - 0.5) * 0.05;
  positions[i + 1] += (Math.random() - 0.5) * 0.05;
  positions[i + 2] += (Math.random() - 0.5) * 0.05;
}

particlesGeometry.setAttribute("position", new BufferAttribute(positions, 3));
particlesGeometry.setAttribute("color", new BufferAttribute(colors, 3));

const particlesMaterial = new PointsMaterial({
  size: 0.005,
  sizeAttenuation: true,
  blending: AdditiveBlending,
});

export function PlayerBody({ position }: { position: [number, number, number] }) {
  const bodyGroup = useRef<Group>(null);

  useFrame((state) => {
    if (!bodyGroup.current) return;
    bodyGroup.current.rotation.x += 0.001;
    bodyGroup.current.rotation.y += 0.001;
    bodyGroup.current.rotation.z += 0.001;
  });

  return (
    <group dispose={null} position={position} ref={bodyGroup}>
      <Float floatIntensity={0.5}>
        <pointLight distance={10} decay={5} intensity={2} />
        <points geometry={particlesGeometry} material={particlesMaterial} />
      </Float>
    </group>
  );
}
