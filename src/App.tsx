import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RingSegment, CentralHub, Spoke, RobotArm, SolarPanel } from './components/StationParts';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STAGES = [
  { id: 0, title: "Aşama 1", description: "İstasyonun 4 parçası etrafta yayılmış durumda." },
  { id: 1, title: "Aşama 2", description: "Parçalar halka formunu oluşturmak üzere yaklaşıyor." },
  { id: 2, title: "Aşama 3", description: "Halka parçaları birbirine kenetlendi." },
  { id: 3, title: "Aşama 4", description: "Merkezi hub halkanın ortasına yerleşiyor." },
  { id: 4, title: "Aşama 5", description: "İç bağlantı boruları hub ve halkayı birleştiriyor." },
  { id: 5, title: "Aşama 6", description: "ARES-X robot kolları ve güneş panelleri monte edildi." },
];

export default function App() {
  const [currentStage, setCurrentStage] = useState(0);

  const nextStage = () => setCurrentStage((prev) => Math.min(prev + 1, STAGES.length - 1));
  const prevStage = () => setCurrentStage((prev) => Math.max(prev - 1, 0));

  const radius = 8;
  const tube = 1.2;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 20, 25], fov: 50 }}>
          <color attach="background" args={['#020617']} />
          <Suspense fallback={null}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Environment preset="night" />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
              <group rotation={[-Math.PI / 6, 0, 0]}>
                {/* 4 Ring Segments */}
                {[0, 1, 2, 3].map((i) => (
                  <RingSegment 
                    key={`ring-${i}`} 
                    angle={(i * Math.PI) / 2} 
                    radius={radius} 
                    tube={tube} 
                    progress={currentStage} 
                  />
                ))}

                {/* Central Hub */}
                <CentralHub progress={currentStage} />

                {/* 4 Spokes */}
                {[0, 1, 2, 3].map((i) => (
                  <Spoke 
                    key={`spoke-${i}`} 
                    angle={(i * Math.PI) / 2} 
                    radius={radius} 
                    progress={currentStage} 
                  />
                ))}

                {/* 4 Robot Arms */}
                {[0, 1, 2, 3].map((i) => (
                  <RobotArm 
                    key={`arm-${i}`} 
                    angle={(i * Math.PI) / 2} 
                    radius={radius + tube} 
                    progress={currentStage} 
                  />
                ))}

                {/* 4 Solar Panels */}
                {[0, 1, 2, 3].map((i) => (
                  <SolarPanel 
                    key={`panel-${i}`} 
                    angle={(i * Math.PI) / 2} 
                    radius={radius + tube} 
                    progress={currentStage} 
                  />
                ))}
              </group>
            </Float>

            <ContactShadows position={[0, -10, 0]} opacity={0.4} scale={40} blur={2} far={10} />
            <OrbitControls makeDefault minDistance={10} maxDistance={50} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12">
        {/* Header */}
        <header className="flex justify-between items-start">
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic"
            >
              ARES-X <span className="text-blue-500">Station</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="text-xs md:text-sm text-white font-mono tracking-widest uppercase"
            >
              Orbital Assembly Simulation v1.0
            </motion.p>
          </div>
          
          <div className="hidden md:block text-right">
            <p className="text-blue-400 font-mono text-xs uppercase tracking-widest">Status</p>
            <p className="text-white font-bold uppercase tracking-tight">
              {currentStage === 5 ? "Assembly Complete" : "In Progress"}
            </p>
          </div>
        </header>

        {/* Stage Info */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="max-w-md pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-tighter">
                    Stage {currentStage + 1}
                  </span>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {STAGES[currentStage].title}
                  </h2>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {STAGES[currentStage].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={prevStage}
                disabled={currentStage === 0}
                className={cn(
                  "px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all",
                  currentStage === 0 
                    ? "bg-white/5 text-white/20 cursor-not-allowed" 
                    : "bg-white/10 text-white hover:bg-white/20 active:scale-95"
                )}
              >
                Geri
              </button>
              <button
                onClick={nextStage}
                disabled={currentStage === STAGES.length - 1}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all",
                  currentStage === STAGES.length - 1
                    ? "bg-blue-600/20 text-blue-400/40 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-900/20"
                )}
              >
                {currentStage === STAGES.length - 1 ? "Tamamlandı" : "Sonraki Aşama"}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full md:w-64 space-y-2 pointer-events-auto">
            <div className="flex justify-between text-[10px] text-gray-500 font-mono uppercase tracking-widest">
              <span>Progress</span>
              <span>{Math.round(((currentStage + 1) / STAGES.length) * 100)}%</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStage + 1) / STAGES.length) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-6 gap-1">
              {STAGES.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => setCurrentStage(s.id)}
                  className={cn(
                    "h-1 rounded-full cursor-pointer transition-all",
                    currentStage >= s.id ? "bg-blue-500" : "bg-white/10 hover:bg-white/20"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle, #ffffff10 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  );
}
