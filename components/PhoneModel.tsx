'use client';

import React, { useRef, useEffect, Suspense } from 'react';
import { useGLTF, useTexture, OrbitControls, Environment } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Model() {
  // Load the 3D model from public/phone.glb
  const { scene } = useGLTF('/phone.glb');
  // Load multiple screenshots for the screen
  const textures = useTexture(['/splash.png', '/ss.png']);
  const modelRef = useRef<THREE.Group>(null);
  const [currentTextureIndex, setCurrentTextureIndex] = React.useState(0);

  // Cycle textures every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextureIndex((prev) => (prev + 1) % textures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [textures.length]);

  useEffect(() => {
    if (!scene) return;
    
    const activeTexture = textures[currentTextureIndex];
    
    // Reset texture to default GLTF settings and ensure update is triggered
    activeTexture.flipY = false;
    activeTexture.center.set(0, 0);
    activeTexture.rotation = 0;
    activeTexture.repeat.set(1, 1);
    activeTexture.colorSpace = THREE.SRGBColorSpace;
    activeTexture.needsUpdate = true;
    
    // Traverse the 3D model and apply the texture to the screen mesh
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name.toLowerCase().includes('screen') || 
            (child.material && child.material.name.toLowerCase().includes('screen')) ||
            child.name.toLowerCase().includes('display')) {
          
          if (!child.material.isMeshStandardMaterial || !child.material.map) {
             child.material = new THREE.MeshStandardMaterial({
               map: activeTexture,
               roughness: 0.1,
               metalness: 0.5,
             });
          } else {
             child.material.map = activeTexture;
             child.material.needsUpdate = true;
          }
        }
      }
    });
  }, [scene, textures, currentTextureIndex]);

  // Add floating/rotation animation
  useFrame((state) => {
    if (modelRef.current) {
      // Offset adjusted for new scale and moved downwards further
      modelRef.current.position.y = (Math.sin(state.clock.elapsedTime) * 0.2) - 3.5;
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 - 0.2;
    }
  });

  // Increased scale slightly
  return <primitive ref={modelRef} object={scene} scale={40} position={[0, -1, 0]} />;
}

export function PhoneModel() {
  return (
    <div className="w-full h-full min-h-[400px] relative z-20">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} className="w-full h-full">
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} />
        <Environment preset="city" />
        
        {/* Main Phone Model wrapped in Suspense for quick non-blocking load */}
        <Suspense fallback={null}>
          <Model />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
