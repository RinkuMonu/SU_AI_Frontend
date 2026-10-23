'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';

const ICONS = [
  '/3d/facebook.glb',
  '/3d/instagram.glb',
  '/3d/linkedin.glb',
  '/3d/pinterest.glb',
  '/3d/snapchat.glb',
  '/3d/telegram.glb',
  '/3d/thread.glb',
  '/3d/twitter x.glb',
  '/3d/instagram.glb',
  '/3d/youtube.glb',
];

// Preload all 10 3D models so they drop without stutter
ICONS.forEach((url) => useGLTF.preload(url));

function FallingIcon({ url, initialPosition }: { url: string; initialPosition: [number, number, number] }) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene, url]);
  const bodyRef = useRef<RapierRigidBody>(null);
  const groupRef = useRef<THREE.Group>(null);

  const scaleTargetRef = useRef(2);
  const stateRef = useRef({
    status: 'falling' as 'falling' | 'grounded' | 'respawning',
    groundTimer: 0,
    maxGroundTime: 3.5 + Math.random() * 3, // Each icon rests on ground for 3.5s - 6.5s before recycling
  });

  const respawn = () => {
    if (!bodyRef.current) return;
    // Spawn across the scene, favoring the right & center-right
    const newX = 2 + (Math.random() - 0.5) * 18;
    const newY = 16 + Math.random() * 8;
    const newZ = (Math.random() - 0.5) * 5;

    bodyRef.current.setTranslation({ x: newX, y: newY, z: newZ }, true);
    bodyRef.current.setLinvel(
      {
        x: (Math.random() - 0.5) * 2,
        y: -1 - Math.random() * 3,
        z: (Math.random() - 0.5) * 1.5,
      },
      true
    );
    bodyRef.current.setAngvel(
      {
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 5,
        z: (Math.random() - 0.5) * 5,
      },
      true
    );

    stateRef.current.status = 'falling';
    stateRef.current.groundTimer = 0;
    stateRef.current.maxGroundTime = 3.5 + Math.random() * 3;
    scaleTargetRef.current = 2;
  };

  useFrame((_, delta) => {
    if (!bodyRef.current || !groupRef.current) return;

    const t = bodyRef.current.translation();

    // If it fell out of bounds / floor
    if (t.y < -15 || Math.abs(t.x) > 22 || Math.abs(t.z) > 15) {
      respawn();
      return;
    }

    // Check state
    if (stateRef.current.status === 'falling') {
      // Reached floor area
      if (t.y < -3.5) {
        stateRef.current.status = 'grounded';
        stateRef.current.groundTimer = 0;
      }
    } else if (stateRef.current.status === 'grounded') {
      stateRef.current.groundTimer += delta;
      if (stateRef.current.groundTimer > stateRef.current.maxGroundTime) {
        stateRef.current.status = 'respawning';
        scaleTargetRef.current = 0; // shrink smoothly before teleporting
      }
    } else if (stateRef.current.status === 'respawning') {
      if (groupRef.current.scale.x < 0.1) {
        respawn();
      }
    }

    // Smooth scale interpolation without garbage collection
    const current = groupRef.current.scale.x;
    const s = THREE.MathUtils.lerp(current, scaleTargetRef.current, Math.min(delta * 8, 1));
    groupRef.current.scale.set(s, s, s);
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders="hull"
      restitution={0.8}
      position={initialPosition}
      rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
    >
      <group ref={groupRef} scale={2}>
        <primitive object={clonedScene} />
      </group>
    </RigidBody>
  );
}

export function FallingIcons() {
  const instances = useMemo(() => {
    const items = [];
    // 30 icons: exactly 3 of each of all 10 icons from public/3d
    for (let i = 0; i < 30; i++) {
      items.push({
        id: i,
        url: ICONS[i % ICONS.length],
        initialPosition: [
          2 + (Math.random() - 0.5) * 18, // Spread nicely across X
          14 + i * 1.5 + Math.random() * 3, // Staggered heights so they drop in a continuous cascade
          (Math.random() - 0.5) * 5,
        ] as [number, number, number],
      });
    }
    return items;
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
      <Canvas camera={{ position: [0, 5, 20], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <Environment preset="city" />

        <React.Suspense fallback={null}>
          <Physics>
            {instances.map((props) => (
              <FallingIcon key={props.id} {...props} />
            ))}

            {/* Invisible Floor to catch the icons like a bucket */}
            <RigidBody type="fixed" position={[0, -5, 0]}>
              <CuboidCollider args={[30, 1, 10]} />
            </RigidBody>

            {/* Invisible Walls so they don't bounce off the sides of the screen */}
            <RigidBody type="fixed" position={[-16, 10, 0]}>
              <CuboidCollider args={[1, 30, 10]} />
            </RigidBody>
            <RigidBody type="fixed" position={[16, 10, 0]}>
              <CuboidCollider args={[1, 30, 10]} />
            </RigidBody>

            {/* Front and back boundary planes to keep them in depth */}
            <RigidBody type="fixed" position={[0, 10, 8]}>
              <CuboidCollider args={[30, 30, 1]} />
            </RigidBody>
            <RigidBody type="fixed" position={[0, 10, -8]}>
              <CuboidCollider args={[30, 30, 1]} />
            </RigidBody>
          </Physics>
        </React.Suspense>
      </Canvas>
    </div>
  );
}
