import React from 'react';
import { Droplets, Power, Flame, Clock } from 'lucide-react';
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext';

export const WaterHeaterCard: React.FC = () => {
  const { entities, toggleEntity, setEntityAttribute } = useHomeAssistant();
  const heater = entities['switch.water_heater'];

  if (!heater) return null;

  const isOn = heater.state === 'on';
  const tankTemp = heater.attributes.tank_temp_c ?? 58;
  const isBoost = heater.attributes.boost ?? false;

  const toggleBoost = () => {
    setEntityAttribute('switch.water_heater', {
      boost: !isBoost,
      tank_temp_c: !isBoost ? 62 : 58
    });
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 ${
      isOn 
        ? 'glass-card-active text-white' 
        : 'glass-card border-white/10 text-white/70 hover:border-white/20 hover:text-white'
    }`}>
      {/* Specular Top Light Ridge */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
            isOn ? 'bg-amber-500/25 border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-white/5 border-white/10 text-white/50'
          }`}>
            <Droplets size={19} />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">Storage Water Heater</h4>
            <p className="text-[11px] text-white/60 font-light">
              {isOn ? 'Master Bathroom Tank • Ready' : 'Heater Standby'}
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleEntity('switch.water_heater')}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
            isOn 
              ? 'bg-amber-500/30 border-amber-400/50 text-amber-200' 
              : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/15 hover:text-white'
          }`}
        >
          <Power size={14} />
        </button>
      </div>

      {/* Tank Temperature Readout & Boost */}
      <div className="mt-5 flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
        <div>
          <span className="text-[11px] text-white/60">Water Tank Temp</span>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className="text-3xl font-light text-white tabular-nums">
              {isOn ? tankTemp : '--'}
            </span>
            <span className="text-base text-white/60">°C</span>
          </div>
        </div>

        {/* 15m Quick Boost */}
        <button
          onClick={toggleBoost}
          disabled={!isOn}
          className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center space-x-1.5 transition-all ${
            isBoost 
              ? 'bg-amber-500/30 border-amber-400/50 text-amber-200 animate-pulse' 
              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
          } disabled:opacity-30`}
        >
          <Flame size={14} className={isBoost ? 'text-amber-400' : ''} />
          <span>{isBoost ? '15m Boost Active' : 'Quick Boost'}</span>
        </button>
      </div>
    </div>
  );
};
