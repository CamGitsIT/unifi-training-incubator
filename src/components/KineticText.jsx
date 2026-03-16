import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function RotatingPrism() {
  const meshRef = useRef(null)
  const [index, setIndex] = useState(0)
  const indexRef = useRef(index)
  indexRef.current = index

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useFrame(() => {
    if (meshRef.current) {
      const targetRotation = indexRef.current * (Math.PI * 2 / 3);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        0.03
      )
    }
  })

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[2.2, 2.2, 3.5, 3]} /> 
      <MeshDistortMaterial 
        color="#00A3E0" 
        speed={0.5} 
        distort={0.05} 
        opacity={0.08} 
        transparent 
      />
      
      {/* Side 1 */}
      <Text position={[0, 0, 1.6]} fontSize={0.16} color="white" maxWidth={2.8} textAlign="center" anchorX="center" anchorY="middle">
        Teach. Simplify. Save.{"\n"}Enjoy. Repeat.
      </Text>
      
      {/* Side 2 */}
      <Text position={[1.4, 0, -0.8]} rotation={[0, Math.PI * 0.66, 0]} fontSize={0.14} color="white" maxWidth={2.5} textAlign="center">
        We're building the first physical Experience Center and National Training Center.
      </Text>

      {/* Side 3 */}
      <Text position={[-1.4, 0, -0.8]} rotation={[0, -Math.PI * 0.66, 0]} fontSize={0.14} color="white" maxWidth={2.5} textAlign="center">
        Developers, property managers, and multi-site operators experience the stack.
      </Text>
    </mesh>
  )
}

export default function KineticText() {
  return (
    <div style={{ 
      width: '100%', 
      height: '350px', // Smaller height to fit in the "gap"
      margin: '20px 0', // Adds breathing room above/below
      position: 'relative', 
      zIndex: 10,
      pointerEvents: 'none'
    }}>
      <Canvas camera={{ position: [0, 0, 5.5] }} alpha={true}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
          <RotatingPrism />
        </Float>
      </Canvas>
    </div>
  )
}