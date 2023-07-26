import { Group, Vector3, MathUtils } from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { BallCollider, RapierRigidBody, RigidBody, useRapier, vec3 } from "@react-three/rapier";
import { PlayerBody } from "./PlayerBody";

const SPEED = 5;
const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();
const rotation = new Vector3();

export function Player({ lerp = MathUtils.lerp }) {
  const body = useRef<Group>(null);
  const ref = useRef<RapierRigidBody>(null);
  const rapier = useRapier();
  const [, get] = useKeyboardControls();
  useFrame((state) => {
    if (!ref.current || !body.current) return;
    const { forward, backward, left, right, jump } = get();
    const velocity = vec3(ref.current.linvel());
    // update camera
    const { x, y, z } = ref.current.translation();
    state.camera.position.set(x, y, z);
    body.current.rotation.copy(state.camera.rotation);
    body.current.position
      .copy(state.camera.position)
      .add(state.camera.getWorldDirection(rotation).multiplyScalar(1));
    // movement
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation);
    ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);
    // jumping
    const world = rapier.world;
    const ray = world.castRay(
      new RAPIER.Ray(ref.current.translation(), { x: 0, y: -1, z: 0 }),
      0,
      true
    );
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75;
    if (jump && grounded) ref.current.setLinvel({ x: 0, y: 2, z: 0 }, true);
  });
  return (
    <>
      <RigidBody
        ref={ref}
        colliders={false}
        mass={1}
        type="dynamic"
        position={[0, 0, 0]}
        enabledRotations={[false, false, false]}
      >
        <BallCollider args={[0.2]} />
      </RigidBody>
      <group
        ref={body}
        onPointerMissed={(e) => body.current && (body.current.children[0].rotation.x = -0.5)}
      >
        <PlayerBody position={[0, 0, 1]} />
      </group>
    </>
  );
}
