import React, { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three/examples/jsm/controls/OrbitControls";
import { Loader2 } from "lucide-react";

// Create a simple sofa using geometric shapes
const legRadius = 0.08; // Larger leg radius
const legHeight = 0.3; // Fixed leg height
const thickness = 0.1; // Arm and back thickness
// Simple OrbitControls component using Three.js directly
function OrbitControls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>();

  useEffect(() => {
    if (!controlsRef.current) {
      // Use Three.js OrbitControls directly
      controlsRef.current = new OrbitControlsImpl(camera, gl.domElement);
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = 0.05;
      controlsRef.current.minPolarAngle = Math.PI / 6;
      controlsRef.current.maxPolarAngle = Math.PI - Math.PI / 6;
    }
  }, [camera, gl]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (controls) {
      const animate = () => {
        controls.update();
        requestAnimationFrame(animate);
      };
      animate();
    }
  }, []);

  return null;
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <Loader2 size={48} className="animate-spin text-primary" />
      <p className="text-gray-600 text-sm">Loading 3D Model...</p>
    </div>
  );
}

// Geometric Sofa Model Component
function SofaModel({ color, dimensions, width, position, rotation, onModelLoad }: any) {
  const groupRef = useRef<any>();

  const sofaGeometry = useMemo(() => {
    return {
      seat: <boxGeometry args={[width, 0.2, dimensions.depth ]} />,
      // args = [width, height, depth] = [x, z, y]
      back: <boxGeometry args={[width, dimensions.height, thickness]} />,
      armLeft: <boxGeometry args={[thickness, dimensions.height * 0.5, dimensions.depth]} />,
      armRight: <boxGeometry args={[thickness, dimensions.height * 0.5, dimensions.depth]} />,
      leg1: <cylinderGeometry args={[legRadius, legRadius, legHeight]} />,
      leg2: <cylinderGeometry args={[legRadius, legRadius, legHeight]} />,
      leg3: <cylinderGeometry args={[legRadius, legRadius, legHeight]} />,
      leg4: <cylinderGeometry args={[legRadius, legRadius, legHeight]} />,
    };
  }, [width, dimensions, legRadius, thickness]);

  const sofaMaterial = useMemo(() => {
    return <meshStandardMaterial color={color} />;
  }, [color]);

  // Notify parent when model is loaded
  useEffect(() => {
    if (onModelLoad) {
      onModelLoad(groupRef.current);
    }
  }, [onModelLoad]);

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Seat - centered at origin */}
      {/* position = [x, z, y] = [width, depth, height] */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        {sofaGeometry.seat}
        {sofaMaterial}
      </mesh>

      {/* Back - starts at top of seat, positioned at rear edge */}
      <mesh
        position={[0, 0.1 + dimensions.height * 0.5, -(dimensions.depth - thickness ) * 0.5]}
        castShadow
        receiveShadow
      >
        {sofaGeometry.back}
        {sofaMaterial}
      </mesh>

      {/* Left Arm - starts at top of seat */}
      <mesh position={[-(width * 0.5 - 0.05), 0.1 + dimensions.height * 0.25, 0]} castShadow receiveShadow>
        {sofaGeometry.armLeft}
        {sofaMaterial}
      </mesh>

      {/* Right Arm - starts at top of seat */}
      <mesh position={[width * 0.5 - 0.05, 0.1 + dimensions.height * 0.25, 0]} castShadow receiveShadow>
        {sofaGeometry.armRight}
        {sofaMaterial}
      </mesh>

      {/* Legs - positioned inside the sofa edges */}
      <mesh position={[-width * 0.4, -0.25, -dimensions.depth * 0.35]} castShadow receiveShadow>
        {sofaGeometry.leg1}
        {sofaMaterial}
      </mesh>
      <mesh position={[width * 0.4, -0.25, -dimensions.depth * 0.35]} castShadow receiveShadow>
        {sofaGeometry.leg2}
        {sofaMaterial}
      </mesh>
      <mesh position={[-width * 0.4, -0.25, dimensions.depth * 0.35]} castShadow receiveShadow>
        {sofaGeometry.leg3}
        {sofaMaterial}
      </mesh>
      <mesh position={[width * 0.4, -0.25, dimensions.depth * 0.35]} castShadow receiveShadow>
        {sofaGeometry.leg4}
        {sofaMaterial}
      </mesh>
    </group>
  );
}

// Main 3D Scene Component
function SofaScene({ color, dimensions, wallWidths, onModelLoad }: any) {
  // Calculate positions for L-shape layout
  const sofaPositions = useMemo(() => {
    const positions = [];
    let currentX = 0;
    let currentZ = 0;

    for (let i = 0; i < wallWidths.length; i++) {
      const width = wallWidths[i];

      if (i === 0) {
        // First sofa - horizontal along X-axis
        positions.push({
          position: [0, 0, 0] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          width: width,
        });
        currentX += width;
        currentZ += dimensions.depth;
      } else if (i === 1) {
        // Second sofa - perpendicular along Z-axis, positioned at the end of first
        positions.push({
          position: [-currentX/2 + dimensions.depth/2 - dimensions.depth, 0, width/2 + dimensions.depth/2 - thickness] as [number, number, number],
          rotation: [0, Math.PI / 2, 0] as [number, number, number],
          width: width,
        });
        currentZ = width;
        currentX = wallWidths[0];
      } else if (i === 2) {
        // Third sofa - horizontal along negative X-axis
        positions.push({
          position: [-currentX/2 + width/2, 0, currentZ - thickness + dimensions.depth] as [number, number, number],
          rotation: [0, Math.PI, 0] as [number, number, number],
          width: width,
        });
        currentX -= width;
      } else if (i === 3) {
        // Fourth sofa - perpendicular along negative Z-axis
        positions.push({
          position: [currentX, 0, currentZ - width / 2] as [number, number, number],
          rotation: [0, -Math.PI / 2, 0] as [number, number, number],
          width: width,
        });
      }
    }

    return positions;
  }, [wallWidths]);

  return (
    <Canvas
      shadows
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Render Multiple Sofas */}
      <Suspense fallback={null}>
        {sofaPositions.map((sofa, index) => (
          <SofaModel
            key={index}
            color={color}
            dimensions={dimensions}
            width={sofa.width}
            position={sofa.position}
            rotation={sofa.rotation}
            onModelLoad={index === 0 ? onModelLoad : undefined}
          />
        ))}
      </Suspense>

      <OrbitControls />
    </Canvas>
  );
}

export default SofaScene;
export { LoadingSpinner };
