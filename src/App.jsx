import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './style.css';

const Cylinder = () => {
  // Load all four textures
  const [texture1, texture2, texture3, texture4] = useLoader(THREE.TextureLoader, [
    '/booking.jpeg',
    '/OIP (1).jpeg',
    '/3d.jpeg',
    '/OIP.jpeg'
  ]);

  // Create a combined texture with minimal gaps
  const combinedTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 3000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // Fill the canvas with black color for gaps
    ctx.fillStyle = '#101010';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Function to load image and draw it on canvas with minimal gap
    const drawImage = (texture, index, totalImages) => {
      if (texture.image) {
        const imageWidth = canvas.width / (totalImages * 1.05);
        const gapWidth = (canvas.width - (imageWidth * totalImages)) / totalImages;
        const x = index * (imageWidth + gapWidth);
        
        try {
          ctx.drawImage(texture.image, x, 0, imageWidth, canvas.height);
        } catch (error) {
          console.error('Error drawing image:', error);
        }
      }
    };

    const totalImages = 4;
    [texture1, texture2, texture3, texture4].forEach((texture, index) => {
      drawImage(texture, index, totalImages);
    });

    const newTexture = new THREE.CanvasTexture(canvas);
    newTexture.needsUpdate = true;
    return newTexture;
  }, [texture1, texture2, texture3, texture4]);

  useEffect(() => {
    combinedTexture.needsUpdate = true;
  }, [combinedTexture]);

  return (
    <group>
      {/* Main cylinder body */}
      <mesh position={[0, 0, 0]} scale={1.5}>
        <cylinderGeometry 
          args={[
            1,      // radiusTop
            1,      // radiusBottom
            2,      // height
            64,     // radialSegments
            1,      // heightSegments
            true,   // openEnded
          ]} 
        />
        <meshStandardMaterial 
          map={combinedTexture}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Bottom cap */}
      <mesh 
        position={[0, -1.5, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        scale={1.5}
      >
        <circleGeometry args={[1, 64]} />
        <meshStandardMaterial color="#101010" />
      </mesh>
    </group>
  );
};

// Loading component
const LoadingScreen = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

function App() {
  const [headerText, setHeaderText] = useState(" Shyam Sunder");
  const messages = [
    "Created by Shyam Sunder",
    "Interactive 3D Cylinder",
    "Click to Change Text!",
    "Amazing Work! 🌟"
  ];

  const handleHeaderClick = () => {
    const currentIndex = messages.indexOf(headerText);
    const nextIndex = (currentIndex + 1) % messages.length;
    setHeaderText(messages[nextIndex]);
  };

  return (
    <>
      <div 
        className="header" 
        onClick={handleHeaderClick}
        data-text={headerText}
      >
        {headerText}
      </div>
      <Canvas
        camera={{ position: [3, 3, 3], fov: 75 }}
      >
        <color attach="background" args={['#101010']} />
        <OrbitControls />
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <Suspense fallback={<LoadingScreen />}>
          <Cylinder />
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;