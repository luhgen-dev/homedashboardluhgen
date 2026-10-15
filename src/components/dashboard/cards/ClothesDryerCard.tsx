import React from 'react';
import { ArrowUp, ArrowDown, Wind, Flame, SunMedium, Sparkles, Lightbulb } from 'lucide-react';
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext';

export const ClothesDryerCard: React.FC = () => {
  const { entities, setEntityAttribute } = useHomeAssistant();
  const dryer = entities['cover.balcony_clothes_dryer'];

  if (!dryer) return null;

  const elevation = dryer.attributes.rack_elevation ?? 85;
  const isBlower = dryer.attributes.blower_active ?? false;
  const isHeater = dryer.attributes.heater_active ?? false;
  const isUV = dryer.attributes.uv_active ?? false;
  const lightOn = dryer.attributes.integrated_light ?? true;

  const setElevation = (val: number) => {
    setEntityAttribute('cover.balcony_clothes_dryer', {
      rack_elevation: Math.min(100, Math.max(0, val))
    });
  };

  const toggleFeature = (key: string, current: boolean) => {
    setEntityAttribute('cover.balcony_clothes_dryer', { [key]: !current });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 border glass-card border-white/10 transition-all duration-300 text-white hover:border-white/20">
      {/* Specular Top Light Ridge */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/20 border border-cyan-400/35 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <SunMedium size={19} />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">Smart Clothes Dryer</h4>
            <p className="text-[11px] text-white/60 font-light">
              Balcony Ceiling Rack • {elevation}% Elevation
            </p>
          </div>
        </div>

        {/* Integrated Rack LED Light */}
        <button
          onClick={() => toggleFeature('integrated_light', lightOn)}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
            lightOn ? 'bg-amber-500/20 border-amber-400/40 text-amber-300' : 'bg-white/5 border-white/10 text-white/40'
          }`}
          title="Toggle Balcony Dryer Light"
        >
          <Lightbulb size={14} />
        </button>
      </div>

      {/* Rack Height Visual Controller */}
      <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/70">Rack Elevation</span>
          <span className="text-xs font-mono text-cyan-300">{elevation}% Height</span>
        </div>

        {/* Elevation Bar with Up/Down buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setElevation(elevation - 15)}
            disabled={elevation <= 0}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-white disabled:opacity-30"
            title="Lower Rack"
          >
            <ArrowDown size={14} />
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={elevation}
            onChange={(e) => setElevation(parseInt(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none bg-white/10 accent-cyan-400 cursor-pointer"
          />

          <button
            onClick={() => setElevation(elevation + 15)}
            disabled={elevation >= 100}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-white disabled:opacity-30"
            title="Raise Rack to Ceiling"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>

      {/* Auxiliary Functions: Air Blower, Warm Drying, UV Sterilization */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {/* Air Blower */}
        <button
          onClick={() => toggleFeature('blower_active', isBlower)}
          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
            isBlower 
              ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 shadow-sm' 
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Wind size={15} className={isBlower ? 'animate-pulse' : ''} />
          <span className="text-[10px] font-medium">Blower</span>
        </button>

        {/* Warm Heater */}
        <button
          onClick={() => toggleFeature('heater_active', isHeater)}
          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
            isHeater 
              ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 shadow-sm' 
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Flame size={15} className={isHeater ? 'animate-pulse' : ''} />
          <span className="text-[10px] font-medium">Warm Dry</span>
        </button>

        {/* UV Disinfection */}
        <button
          onClick={() => toggleFeature('uv_active', isUV)}
          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
            isUV 
              ? 'bg-purple-500/25 border-purple-400/40 text-purple-300 shadow-sm' 
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Sparkles size={15} />
          <span className="text-[10px] font-medium">UV 30m</span>
        </button>
      </div>
    </div>
  );
};
