'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import {
  Physics,
  RigidBody,
  CuboidCollider,
  BallCollider,
  RapierRigidBody,
} from '@react-three/rapier';
import * as THREE from 'three';

const ICONS = [
  '/3d/facebook.glb',
  '/3d/instagram.glb',
  '/3d/linkedin.glb',
  '/3d/pinterest.glb',
  '/3d/snapchat.glb',
  '/3d/telegram.glb',
  '/3d/thread.glb',
  encodeURI('/3d/twitter x.glb'),
  '/3d/whatsapp.glb',
  '/3d/youtube.glb',
];

// Preload models for seamless instant rendering
ICONS.forEach((url) => useGLTF.preload(url));

interface IconProps {
  url: string;
  initialPosition: [number, number, number];
}

function FallingIcon({ url, initialPosition }: IconProps) {
  const { scene } = useGLTF(url);
  const bodyRef = useRef<RapierRigidBody>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Normalize and center the 3D model geometry so every icon has the exact same visual weight
  const normalizedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Center geometry around (0,0,0)
    clone.position.sub(center);

    // Target uniform size (approx 1.7 units)
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const normScale = 1.75 / maxDim;
      clone.scale.multiplyScalar(normScale);
    }

    // Enhance materials for vibrancy and glossy sheen
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material.isMeshStandardMaterial) {
          child.material.roughness = 0.25;
          child.material.metalness = 0.2;
          child.material.envMapIntensity = 1.5;
        }
      }
    });

    return clone;
  }, [scene]);

  const scaleTargetRef = useRef(1);
  const stateRef = useRef({
    status: 'falling' as 'falling' | 'grounded' | 'respawning',
    groundTimer: 0,
    maxGroundTime: 4 + Math.random() * 4, // Rests on floor for 4s - 8s before smooth recycling
  });

  const respawn = () => {
    if (!bodyRef.current) return;
    // Spread across the canvas, biased towards the center-right where hero content leaves open room
    const newX = 1 + (Math.random() - 0.45) * 22;
    const newY = 16 + Math.random() * 10;
    const newZ = (Math.random() - 0.5) * 6;

    bodyRef.current.setTranslation({ x: newX, y: newY, z: newZ }, true);
    bodyRef.current.setLinvel(
      {
        x: (Math.random() - 0.5) * 3,
        y: -1 - Math.random() * 4,
        z: (Math.random() - 0.5) * 2,
      },
      true
    );
    bodyRef.current.setAngvel(
      {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 4,
      },
      true
    );

    stateRef.current.status = 'falling';
    stateRef.current.groundTimer = 0;
    stateRef.current.maxGroundTime = 4 + Math.random() * 4;
    scaleTargetRef.current = 1;
  };

  useFrame((_, delta) => {
    if (!bodyRef.current || !groupRef.current) return;

    const t = bodyRef.current.translation();

    // Catch out-of-bounds drops
    if (t.y < -12 || Math.abs(t.x) > 24 || Math.abs(t.z) > 12) {
      respawn();
      return;
    }

    // Lifecycle check: Falling -> Grounded -> Fade/Shrink -> Respawn
    if (stateRef.current.status === 'falling') {
      if (t.y < -3.5) {
        stateRef.current.status = 'grounded';
        stateRef.current.groundTimer = 0;
      }
    } else if (stateRef.current.status === 'grounded') {
      stateRef.current.groundTimer += delta;
      if (stateRef.current.groundTimer > stateRef.current.maxGroundTime) {
        stateRef.current.status = 'respawning';
        scaleTargetRef.current = 0; // Smooth shrink before teleporting back to top
      }
    } else if (stateRef.current.status === 'respawning') {
      if (groupRef.current.scale.x < 0.08) {
        respawn();
      }
    }

    // Smooth lerp scale for pop-in and fade-out
    const current = groupRef.current.scale.x;
    const target = hovered ? scaleTargetRef.current * 1.15 : scaleTargetRef.current;
    const s = THREE.MathUtils.lerp(current, target, Math.min(delta * 9, 1));
    groupRef.current.scale.set(s, s, s);
  });

  // Fun interaction: Click to launch icon upward with playful spin!
  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!bodyRef.current) return;
    bodyRef.current.applyImpulse(
      {
        x: (Math.random() - 0.5) * 12,
        y: 16 + Math.random() * 8,
        z: (Math.random() - 0.5) * 8,
      },
      true
    );
    bodyRef.current.applyTorqueImpulse(
      {
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 6,
        z: (Math.random() - 0.5) * 6,
      },
      true
    );
  };

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      restitution={0.65}
      friction={0.3}
      position={initialPosition}
      rotation={[
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ]}
    >
      {/* BallCollider ensures frictionless rolling, natural bouncing, and zero corner-sticking */}
      <BallCollider args={[0.95]} />
      <group
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          if (typeof document !== "undefined") document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          if (typeof document !== "undefined") document.body.style.cursor = "auto";
        }}
      >
        <primitive object={normalizedScene} />
      </group>
    </RigidBody>
  );
}

// Mouse repulsion sphere: follows user cursor and deflects nearby 3D icons
function MouseRepeller() {
  const mouseRef = useRef<RapierRigidBody>(null);
  const targetPos = useRef(new THREE.Vector3(999, 999, 999));

  useFrame(({ pointer, camera }) => {
    if (!mouseRef.current) return;

    if (Math.abs(pointer.x) <= 1 && Math.abs(pointer.y) <= 1) {
      const vec = new THREE.Vector3(pointer.x, pointer.y, 0.5);
      vec.unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));

      targetPos.current.lerp(worldPos, 0.35);

      mouseRef.current.setNextKinematicTranslation({
        x: targetPos.current.x,
        y: targetPos.current.y,
        z: 0,
      });
    } else {
      mouseRef.current.setNextKinematicTranslation({ x: 999, y: 999, z: 999 });
    }
  });

  return (
    <RigidBody ref={mouseRef} type="kinematicPosition" colliders={false}>
      <BallCollider args={[2.2]} />
    </RigidBody>
  );
}

export function FallingIcons() {
  // Generate 18 distinct falling icons distributed across the cascade
  const instances = useMemo(() => {
    const items = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        url: ICONS[i % ICONS.length],
        initialPosition: [
          1 + (Math.random() - 0.45) * 22,
          10 + i * 1.8 + Math.random() * 4,
          (Math.random() - 0.5) * 5,
        ] as [number, number, number],
      });
    }
    return items;
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto select-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 3, 18], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
        }}
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[12, 14, 8]} intensity={2.6} />
        <directionalLight position={[-12, 8, -6]} intensity={1.2} color="#fc9a5d" />
        <Environment preset="city" />

        <React.Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            {/* Interactive mouse collider to deflect falling icons */}
            <MouseRepeller />

            {/* Falling 3D Social Media & App Icons */}
            {instances.map((props) => (
              <FallingIcon key={props.id} {...props} />
            ))}

            {/* Invisible Floor to catch icons cleanly at bottom curve */}
            <RigidBody type="fixed" position={[0, -5.5, 0]}>
              <CuboidCollider args={[35, 1, 12]} />
            </RigidBody>

            {/* Invisible Left & Right Side Walls */}
            <RigidBody type="fixed" position={[-18, 8, 0]}>
              <CuboidCollider args={[1, 35, 12]} />
            </RigidBody>
            <RigidBody type="fixed" position={[18, 8, 0]}>
              <CuboidCollider args={[1, 35, 12]} />
            </RigidBody>

            {/* Front & Back Depth Barriers */}
            <RigidBody type="fixed" position={[0, 8, 7]}>
              <CuboidCollider args={[35, 35, 1]} />
            </RigidBody>
            <RigidBody type="fixed" position={[0, 8, -7]}>
              <CuboidCollider args={[35, 35, 1]} />
            </RigidBody>
          </Physics>
        </React.Suspense>
      </Canvas>
    </div>
  );
}
