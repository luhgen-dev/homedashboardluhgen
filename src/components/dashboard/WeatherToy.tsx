import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Sun, Cloud, CloudSun, 
  CloudRain, CloudLightning, Moon, X,
  Compass
} from 'lucide-react';
import { WeatherCondition } from '../AmbientWeather';

interface WeatherToyProps {
  vibe: WeatherCondition | 'auto';
  setVibe: (v: WeatherCondition | 'auto') => void;
  displayWeather: string;
}

const WEATHER_PRESETS = [
  { id: 'auto', label: 'Auto (Live)', icon: Sparkles, color: 'text-white hover:bg-white/20' },
  { id: 'sunny', label: 'Clear Sky', icon: Sun, color: 'text-amber-400 hover:bg-amber-500/20' },
  { id: 'sunset', label: 'Golden Hour', icon: CloudSun, color: 'text-orange-400 hover:bg-orange-500/20' },
  { id: 'cloudy', label: 'Overcast', icon: Cloud, color: 'text-slate-300 hover:bg-slate-500/20' },
  { id: 'rainy', label: 'Window Rain', icon: CloudRain, color: 'text-blue-400 hover:bg-blue-500/20' },
  { id: 'stormy', label: 'Thunderstorm', icon: CloudLightning, color: 'text-purple-400 hover:bg-purple-500/20' },
  { id: 'night', label: 'Moon & Stars', icon: Moon, color: 'text-indigo-400 hover:bg-indigo-500/20' },
];

export const WeatherToy: React.FC<WeatherToyProps> = ({ vibe, setVibe, displayWeather }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-30 pointer-events-auto">
      {/* Pop-out Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-14 right-0 mb-2 w-56 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/20 p-2 shadow-2xl space-y-1"
          >
            <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
                Atmosphere Engine
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 capitalize">
                {displayWeather}
              </span>
            </div>

            <div className="py-1">
              {WEATHER_PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = vibe === preset.id;

                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setVibe(preset.id as WeatherCondition | 'auto');
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${preset.color} ${
                      isSelected ? 'bg-white/20 border border-white/30 text-white' : 'text-white/70'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{preset.label}</span>
                    {isSelected && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-xl backdrop-blur-xl transition-all duration-300 active:scale-95 ${
          isOpen
            ? 'bg-white/30 border-white/40 text-white'
            : 'bg-black/40 border-white/20 text-white/80 hover:bg-black/60 hover:text-white hover:border-white/40'
        }`}
        title="Atmospheric Atmosphere Toy"
      >
        {isOpen ? <X size={18} /> : <Compass size={19} className="animate-spin-slow" />}
      </button>
    </div>
  );
};
