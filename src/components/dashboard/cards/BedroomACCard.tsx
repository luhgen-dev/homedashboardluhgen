import React from 'react';
import { Moon, ThermometerSnowflake, Power, Wind, Bed } from 'lucide-react';
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext';

export const BedroomACCard: React.FC<{ onExpand?: () => void }> = ({ onExpand }) => {
  const { entities, callService, toggleEntity } = useHomeAssistant();
  const ac = entities['climate.bedroom_ac'];

  if (!ac) return null;

  const isOn = ac.state === 'cool' || ac.state === 'on';
  const targetTemp = ac.attributes.temperature ?? 23;
  const currentTemp = ac.attributes.current_temperature ?? 25.8;

  const adjustTemp = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTemp = Math.min(30, Math.max(16, targetTemp + delta));
    callService('climate', 'set_temperature', {
      entity_id: 'climate.bedroom_ac',
      temperature: newTemp
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
            isOn ? 'bg-indigo-500/25 border-indigo-400/40 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-white/5 border-white/10 text-white/50'
          }`}>
            <Moon size={19} />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">Master Bedroom AC</h4>
            <p className="text-[11px] text-white/60 font-light">
              {isOn ? `Quiet Sleep Mode • Ambient ${currentTemp}°C` : 'Turned Off'}
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleEntity('climate.bedroom_ac')}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
            isOn 
              ? 'bg-indigo-500/30 border-indigo-400/50 text-indigo-200' 
              : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/15 hover:text-white'
          }`}
        >
          <Power size={14} />
        </button>
      </div>

      {/* Target Temperature & Stepper */}
      <div className="mt-5 flex items-baseline justify-between">
        <div className="flex items-baseline space-x-1">
          <span className="text-4xl font-light tracking-tight text-white tabular-nums">
            {targetTemp}
          </span>
          <span className="text-xl font-light text-white/60">°C</span>
          {isOn && (
            <span className="ml-2 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Sleep Curve
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={(e) => adjustTemp(-1, e)}
            disabled={!isOn}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 active:scale-95 border border-white/10 text-white text-base disabled:opacity-30"
          >
            -
          </button>
          <button
            onClick={(e) => adjustTemp(1, e)}
            disabled={!isOn}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 active:scale-95 border border-white/10 text-white text-base disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>

      {/* Sleep Quick Preset */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
        <span className="flex items-center space-x-1.5">
          <Bed size={13} className="text-indigo-400" />
          <span>Whisper Mode (19 dB)</span>
        </span>
        <span className="text-white/40 text-[11px]">8h Timer Ready</span>
      </div>
    </div>
  );
};
