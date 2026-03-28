import { useMemo } from 'react';
import * as THREE from 'three';
import { a, useSpring } from '@react-spring/three';

export function RingSegment({ angle, radius, tube, progress }: { angle: number, radius: number, tube: number, progress: number }) {
  const geometry = useMemo(() => {
    return new THREE.TorusGeometry(radius, tube, 16, 100, Math.PI / 2);
  }, [radius, tube]);

  let targetX = 0, targetY = 0, targetZ = 0;
  let targetRotationZ = angle;

  if (progress === 0) {
    const offset = 15;
    targetX = Math.cos(angle) * offset;
    targetY = Math.sin(angle) * offset;
    targetZ = (angle % 2 === 0 ? 5 : -5);
    targetRotationZ += 0.5;
  } else if (progress === 1) {
    const offset = radius + 2;
    targetX = Math.cos(angle) * offset;
    targetY = Math.sin(angle) * offset;
  } else {
    targetRotationZ = angle - Math.PI/4;
    targetX = 0;
    targetY = 0;
  }

  const { position, rotation } = useSpring({
    position: [targetX, targetY, targetZ],
    rotation: [0, 0, targetRotationZ],
    config: { mass: 1, tension: 120, friction: 26 }
  });

  return (
    <a.mesh position={position as any} rotation={rotation as any}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
    </a.mesh>
  );
}

export function CentralHub({ progress }: { progress: number }) {
  const targetZ = progress < 3 ? 30 : 0;
  const targetOpacity = progress < 3 ? 0 : 1;

  const { z, opacity } = useSpring({
    z: targetZ,
    opacity: targetOpacity,
    config: { duration: 1000 }
  });

  return (
    <a.group position-z={z}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 6, 32]} />
        <a.meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0, 3.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <a.meshStandardMaterial color="#4b5563" metalness={0.9} roughness={0.1} transparent opacity={opacity} />
      </mesh>
    </a.group>
  );
}

export function Spoke({ angle, radius, progress }: { angle: number, radius: number, progress: number }) {
  const length = radius - 1.5;
  const active = progress >= 4;
  
  const x = Math.cos(angle) * (1.5 + length / 2);
  const y = Math.sin(angle) * (1.5 + length / 2);

  const { scale, opacity } = useSpring({
    scale: active ? 1 : 0,
    opacity: active ? 1 : 0,
  });

  return (
    <a.mesh 
      position={[x, y, 0]} 
      rotation={[0, 0, angle]}
      scale={scale as any}
    >
      <boxGeometry args={[length, 0.4, 0.4]} />
      <a.meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} transparent opacity={opacity} />
    </a.mesh>
  );
}

export function RobotArm({ angle, radius, progress }: { angle: number, radius: number, progress: number }) {
  const active = progress >= 5;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  const { scale, opacity } = useSpring({
    scale: active ? 1 : 0,
    opacity: active ? 1 : 0,
    delay: active ? 200 : 0
  });

  return (
    <a.group 
      position={[x, y, 0]} 
      rotation={[0, 0, angle]}
      scale={scale as any}
    >
      <mesh position={[0.5, 0, 0]}>
        <boxGeometry args={[1, 0.8, 0.8]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[1.5, 0.5, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[2, 0.3, 0.3]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      <mesh position={[2.5, 1.5, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[1.5, 0.3, 0.3]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      <mesh position={[3.2, 1.8, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </a.group>
  );
}

export function SolarPanel({ angle, radius, progress }: { angle: number, radius: number, progress: number }) {
  const active = progress >= 5;
  const panelAngle = angle + Math.PI / 4;
  const x = Math.cos(panelAngle) * radius;
  const y = Math.sin(panelAngle) * radius;

  const { scale, opacity } = useSpring({
    scale: active ? 1 : 0,
    opacity: active ? 1 : 0,
    delay: active ? 400 : 0
  });

  return (
    <a.mesh 
      position={[x, y, 0]} 
      rotation={[Math.PI / 2, 0, panelAngle]}
      scale={scale as any}
    >
      <boxGeometry args={[3, 1.5, 0.1]} />
      <a.meshStandardMaterial color="#1e40af" emissive="#1e3a8a" emissiveIntensity={0.5} transparent opacity={opacity} />
    </a.mesh>
  );
}
