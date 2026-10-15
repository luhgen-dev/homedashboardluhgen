import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'night';

interface AmbientWeatherProps {
  condition: WeatherCondition;
}

export function AmbientWeather({ condition }: AmbientWeatherProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {condition === 'sunny' && <SunnyScene key="sunny" />}
        {condition === 'cloudy' && <CloudyScene key="cloudy" />}
        {condition === 'rainy' && <RainyScene key="rainy" />}
        {condition === 'stormy' && <StormyScene key="stormy" />}
        {condition === 'night' && <NightScene key="night" />}
      </AnimatePresence>
    </div>
  );
}

// --- SCENES ---
// AmbientWeather is now a subtle support layer.
// Colors are soft washes, motion is minimal, elements are faint veils.

function SunnyScene() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3 }}
      className="absolute inset-0 bg-gradient-to-b from-[#4a90e2]/10 via-[#87ceeb]/5 to-transparent"
    >
      {/* Soft atmospheric warm glow, not a literal sun */}
      <motion.div 
        className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#ffeedd] blur-[120px] opacity-20"
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

function CloudyScene() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3 }}
      className="absolute inset-0 bg-gradient-to-b from-[#6a8596]/20 via-[#8ba3b0]/10 to-transparent"
    >
      <MistLayer speed={100} opacity={0.1} top="10%" scale={2} color="bg-slate-300" />
    </motion.div>
  );
}

function RainyScene() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3 }}
      className="absolute inset-0 bg-gradient-to-b from-[#2a3b4c]/30 via-[#3e4f60]/10 to-transparent"
    >
      <MistLayer speed={80} opacity={0.15} top="0%" scale={2.5} color="bg-slate-400" />
      {/* Faint foreground veil */}
      <RainSystem intensity="normal" />
    </motion.div>
  );
}

function StormyScene() {
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const triggerLightning = () => {
      setFlash(Math.random());
      const nextFlash = Math.random() * 8000 + 4000; // 4 to 12 seconds
      timeoutId = setTimeout(triggerLightning, nextFlash);
    };
    timeoutId = setTimeout(triggerLightning, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3 }}
      className="absolute inset-0 bg-gradient-to-b from-[#121820]/50 via-[#1e2a38]/20 to-transparent"
    >
      {/* Subtle atmospheric flash, not a blinding screen overlay */}
      <motion.div
        key={flash}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0, 0.05, 0] }}
        transition={{ duration: 0.8, times: [0, 0.1, 0.3, 0.5, 1] }}
        className="absolute inset-0 bg-[#aaccff] mix-blend-overlay pointer-events-none"
      />

      <MistLayer speed={60} opacity={0.2} top="-10%" scale={3} color="bg-slate-600" />
      <RainSystem intensity="heavy" />
    </motion.div>
  );
}

function NightScene() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3 }}
      className="absolute inset-0 bg-gradient-to-b from-[#05080a]/60 via-[#0a1118]/30 to-transparent"
    >
      {/* Soft lunar atmospheric wash */}
      <motion.div 
        className="absolute top-[0%] left-[10%] w-[600px] h-[600px] rounded-full bg-[#aaccff] blur-[120px] opacity-10"
      />
      
      <StarField />
      <MistLayer speed={150} opacity={0.05} top="20%" scale={2} color="bg-slate-400" />
    </motion.div>
  );
}

// --- HELPERS ---

// Replaces CloudLayer. Now acts as a soft, shapeless atmospheric mist.
function MistLayer({ speed, opacity, top, scale, color = "bg-white", delay = 0 }: { speed: number, opacity: number, top: string, scale: number, color?: string, delay?: number }) {
  return (
    <motion.div
      className="absolute left-[-20%] right-[-20%] h-[400px] flex justify-around pointer-events-none"
      style={{ top, opacity, scale }}
      animate={{ 
        x: ["-5%", "5%", "-5%"],
        opacity: [opacity, opacity * 0.7, opacity],
        scale: [scale, scale * 1.05, scale]
      }}
      transition={{ duration: speed, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {[...Array(3)].map((_, i) => (
        <div key={i} className={`w-[800px] h-[300px] ${color} rounded-[100%] blur-[100px] shrink-0 opacity-50`} />
      ))}
    </motion.div>
  );
}

function RainSystem({ intensity }: { intensity: 'normal' | 'heavy' }) {
  // Stable particle generation
  const drops = useMemo(() => {
    const dropCount = intensity === 'heavy' ? 30 : 12; // Drastically reduced for just a faint veil
    return Array.from({ length: dropCount }).map(() => ({
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 0.5 + 0.8}s`, // Slower, softer fall
      animationDelay: `${Math.random() * 2}s`,
      opacity: Math.random() * 0.15 + 0.05, // Very faint
      width: '1px',
      height: `${Math.random() * 30 + 20}px`
    }));
  }, [intensity]);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rain-container">
      {drops.map((drop, i) => (
        <div
          key={i}
          className="absolute top-[-100px] bg-gradient-to-b from-transparent to-white/40 rounded-full rain-drop"
          style={drop}
        />
      ))}
    </div>
  );
}

function StarField() {
  // Stable, faint stars
  const stars = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({ // Reduced count
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 1.5 + 0.5}px`,
      animationDuration: `${Math.random() * 4 + 4}s`, // Slower twinkle
      animationDelay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.2 + 0.1 // Fainter
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full star-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDuration: star.animationDuration,
            animationDelay: star.animationDelay,
            opacity: star.opacity
          }}
        />
      ))}
    </div>
  );
}
