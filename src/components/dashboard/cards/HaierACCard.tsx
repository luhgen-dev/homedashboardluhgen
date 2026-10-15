import React from 'react';
import { ThermometerSnowflake, Wind, Flame, Power, ChevronRight, Sparkles } from 'lucide-react';
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext';

export const HaierACCard: React.FC<{ onExpand: () => void }> = ({ onExpand }) => {
  const { entities, callService, toggleEntity } = useHomeAssistant();
  const ac = entities['climate.living_room_hall_ac'];

  if (!ac) return null;

  const isCooling = ac.state === 'cool';
  const targetTemp = ac.attributes.temperature ?? 24;
  const currentTemp = ac.attributes.current_temperature ?? 26.5;
  const fanMode = ac.attributes.fan_mode ?? 'auto';

  const adjustTemp = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTemp = Math.min(30, Math.max(16, targetTemp + delta));
    callService('climate', 'set_temperature', {
      entity_id: 'climate.living_room_hall_ac',
      temperature: newTemp
    });
  };

  return (
    <div 
      onClick={onExpand}
      className={`group relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 cursor-pointer ${
        isCooling 
          ? 'glass-card-active text-white' 
          : 'glass-card border-white/10 text-white/70 hover:border-white/20 hover:text-white'
      }`}
    >
      {/* Specular Top Light Ridge */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

      {/* Background radial glow when cooling */}
      {isCooling && (
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none animate-pulse" />
      )}

      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
            isCooling ? 'bg-cyan-500/25 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-white/5 border-white/10 text-white/50'
          }`}>
            <ThermometerSnowflake size={19} className={isCooling ? 'animate-spin-slow' : ''} />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">Hall Haier AC</h4>
            <p className="text-[11px] text-white/60 font-light">
              {isCooling ? `Cooling • Ambient ${currentTemp}°C` : 'Turned Off'}
            </p>
          </div>
        </div>

        {/* Power Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleEntity('climate.living_room_hall_ac');
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
            isCooling 
              ? 'bg-cyan-500/25 border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/40' 
              : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/15 hover:text-white'
          }`}
          title="Toggle AC Power"
        >
          <Power size={14} />
        </button>
      </div>

      {/* Main Temperature & Control Cluster */}
      <div className="mt-5 flex items-baseline justify-between">
        <div className="flex items-baseline space-x-1">
          <span className="text-4xl font-light tracking-tight text-white tabular-nums drop-shadow-sm">
            {targetTemp}
          </span>
          <span className="text-xl font-light text-white/60">°C</span>
          {isCooling && (
            <span className="ml-2 text-[11px] font-medium px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Set
            </span>
          )}
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => adjustTemp(-1, e)}
            disabled={!isCooling || targetTemp <= 16}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 active:scale-95 border border-white/10 text-white text-base disabled:opacity-30 disabled:cursor-not-allowed"
          >
            -
          </button>
          <button
            onClick={(e) => adjustTemp(1, e)}
            disabled={!isCooling || targetTemp >= 30}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 active:scale-95 border border-white/10 text-white text-base disabled:opacity-30 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Mode & Fan Speed Footer */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1 text-white/70">
            <Wind size={13} className="text-cyan-400" />
            <span className="capitalize">{fanMode} Fan</span>
          </span>
          <span className="text-white/30">•</span>
          <span className="text-white/50 text-[11px]">Auto Inverter</span>
        </div>

        <div className="flex items-center space-x-1 text-[11px] text-cyan-300 group-hover:translate-x-0.5 transition-transform">
          <span>Details</span>
          <ChevronRight size={13} />
        </div>
      </div>
    </div>
  );
};
