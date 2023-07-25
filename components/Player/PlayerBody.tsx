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
  // This will create all points in a sphere shape around the origin
  var radius = 0.04;
  var phi = Math.random() * 2.0 * Math.PI;
  var theta = Math.random() * 2.0 * Math.PI;

  positions[i] = radius * Math.sin(theta) * Math.cos(phi); // x
  positions[i + 1] = radius * Math.sin(theta) * Math.sin(phi); // y
  positions[i + 2] = radius * Math.cos(theta); // z

  // Add some noise to make the sphere less perfect
  positions[i] += (Math.random() - 0.5) * 0.05;
  positions[i + 1] += (Math.random() - 0.5) * 0.05;
  positions[i + 2] += (Math.random() - 0.5) * 0.05;
}

particlesGeometry.setAttribute("position", new BufferAttribute(positions, 3)); // Create the js BufferAttribute and specify that each information is composed of 3 values
particlesGeometry.setAttribute("color", new BufferAttribute(colors, 3)); // Create the js BufferAttribute and specify that each information is composed of 3 values

// Material

const particlesMaterial = new PointsMaterial({
  size: 0.005,
  sizeAttenuation: true,
  blending: AdditiveBlending,
});

export function PlayerBody({ position }: { position: [number, number, number] }) {
  const bodyGroup = useRef<Group>(null);
  // animate the particles to rotate on all axes
  useFrame((state) => {
    if (!bodyGroup.current) return;
    bodyGroup.current.rotation.x += 0.001;
    bodyGroup.current.rotation.y += 0.001;
    bodyGroup.current.rotation.z += 0.001;
  });

  return (
    <group dispose={null} position={position} ref={bodyGroup}>
      <Float floatIntensity={0.5}>
        <points geometry={particlesGeometry} material={particlesMaterial} />
      </Float>
    </group>
  );
}
