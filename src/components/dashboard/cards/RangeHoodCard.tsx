import React from 'react';
import { Wind, Power, Lightbulb, Gauge } from 'lucide-react';
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext';

export const RangeHoodCard: React.FC = () => {
  const { entities, callService, toggleEntity, setEntityAttribute } = useHomeAssistant();
  const hood = entities['fan.kitchen_exhaust'];

  if (!hood) return null;

  const isOn = hood.state === 'on';
  const speed = hood.attributes.speed_level ?? 0;
  const lightOn = hood.attributes.light_on ?? true;
  const filterLife = hood.attributes.filter_life_percent ?? 88;

  const setSpeedLevel = (lvl: number) => {
    callService('fan', lvl > 0 ? 'turn_on' : 'turn_off', {
      entity_id: 'fan.kitchen_exhaust',
      speed_level: lvl
    });
    setEntityAttribute('fan.kitchen_exhaust', { speed_level: lvl });
  };

  const toggleTaskLight = () => {
    setEntityAttribute('fan.kitchen_exhaust', { light_on: !lightOn });
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 ${
      isOn 
        ? 'glass-card-active text-white' 
        : 'glass-card border-white/10 text-white/70 hover:border-white/20 hover:text-white'
    }`}>
      {/* Specular Top Light Ridge */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
            isOn ? 'bg-blue-500/25 border-blue-400/40 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/10 text-white/50'
          }`}>
            <Wind size={19} />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">Kitchen Range Hood</h4>
            <p className="text-[11px] text-white/60 font-light">
              {isOn ? `Extraction Level ${speed} • Air Flow High` : 'Extraction Inactive'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Under-Hood Task Light */}
          <button
            onClick={toggleTaskLight}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
              lightOn ? 'bg-amber-500/20 border-amber-400/40 text-amber-300' : 'bg-white/5 border-white/10 text-white/40'
            }`}
            title="Toggle Cooktop Light"
          >
            <Lightbulb size={14} />
          </button>

          {/* Master Power */}
          <button
            onClick={() => setSpeedLevel(isOn ? 0 : 2)}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
              isOn ? 'bg-blue-500/30 border-blue-400/50 text-blue-200' : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            <Power size={14} />
          </button>
        </div>
      </div>

      {/* Speed Selector Buttons */}
      <div className="mt-5 grid grid-cols-4 gap-1.5">
        {[
          { label: 'Off', lvl: 0 },
          { label: 'Low', lvl: 1 },
          { label: 'Med', lvl: 2 },
          { label: 'Boost', lvl: 3 }
        ].map((s) => (
          <button
            key={s.lvl}
            onClick={() => setSpeedLevel(s.lvl)}
            className={`py-2 rounded-xl text-xs font-medium border text-center transition-all ${
              (isOn && speed === s.lvl) || (!isOn && s.lvl === 0)
                ? 'bg-blue-500/30 border-blue-400/50 text-blue-200 shadow-sm'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Filter Health Indicator */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
        <span className="flex items-center space-x-1">
          <Gauge size={12} className="text-blue-400" />
          <span>Carbon Filter Health</span>
        </span>
        <span className="font-mono text-emerald-400">{filterLife}% OK</span>
      </div>
    </div>
  );
};
