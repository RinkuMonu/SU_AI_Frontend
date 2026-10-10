'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';

const ICONS = [
  '/3d/facebook.glb',
  '/3d/instagram.glb',
  '/3d/linkedin.glb',
  '/3d/whatsapp.glb',
  '/3d/youtube.glb',
];

function FallingIcon({ url, position }: { url: string; position: [number, number, number] }) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene, url]);
  
  return (
    <RigidBody 
      colliders="hull" 
      restitution={0.8} // High restitution makes it bounce nicely
      position={position} 
      rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
    >
      <primitive object={clonedScene} scale={2} />
    </RigidBody>
  );
}

export function FallingIcons() {
  // Generate a bunch of icons dropping from the sky
  const instances = useMemo(() => {
    const items = [];
    // Spawn 40 icons for a good "bucket filling" effect
    for (let i = 0; i < 40; i++) {
      items.push({
        id: i,
        url: ICONS[i % ICONS.length],
        position: [
          (Math.random() - 0.5) * 20, // Spread across X axis width
          15 + Math.random() * 40,    // Drop from different random heights so they fall sequentially
          (Math.random() - 0.5) * 5   // Spread slightly in Z to give depth
        ] as [number, number, number]
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
        
        <Physics>
          {instances.map((props) => (
            <FallingIcon key={props.id} {...props} />
          ))}

          {/* Invisible Floor to catch the icons like a bucket */}
          <RigidBody type="fixed" position={[0, -5, 0]}>
            <CuboidCollider args={[30, 1, 10]} />
          </RigidBody>
          
          {/* Invisible Walls so they don't bounce off the sides of the screen */}
          <RigidBody type="fixed" position={[-15, 10, 0]}>
            <CuboidCollider args={[1, 30, 10]} />
          </RigidBody>
          <RigidBody type="fixed" position={[15, 10, 0]}>
            <CuboidCollider args={[1, 30, 10]} />
          </RigidBody>
        </Physics>
      </Canvas>
    </div>
  );
}
