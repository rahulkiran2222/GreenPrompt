"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

function ParticleField({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000 * 3; i++) arr[i] = (Math.random() - 0.5) * 25;
    return arr;
  }, []);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.04;
      ref.current.rotation.x += dt * 0.015;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color={color} transparent opacity={0.7} />
    </points>
  );
}

export default function ThreeBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const particleColor = isDark ? "#10b981" : "#059669";

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.4} />
        <ParticleField color={particleColor} />
      </Canvas>
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #020617 0%, #0f172a 50%, rgba(6,78,59,0.3) 100%)"
            : "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, rgba(16,185,129,0.08) 100%)",
        }}
      />
    </div>
  );
}
