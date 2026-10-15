import React from 'react';
import { Lightbulb, Sun, Power, Sparkles } from 'lucide-react';
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext';

export const DiningLightCard: React.FC = () => {
  const { entities, callService, toggleEntity } = useHomeAssistant();
  const light = entities['light.dining_table_light'];

  if (!light) return null;

  const isOn = light.state === 'on';
  const brightness = light.attributes.brightness ?? 200; // 0 - 255
  const colorTemp = light.attributes.color_temp ?? 340; // 153 (cool) to 500 (warm)

  const handleBrightnessChange = (val: number) => {
    callService('light', 'turn_on', {
      entity_id: 'light.dining_table_light',
      brightness: val
    });
  };

  const handleColorTemp = (temp: number) => {
    callService('light', 'turn_on', {
      entity_id: 'light.dining_table_light',
      color_temp: temp
    });
  };

  const scenes = [
    { label: 'Dinner Candle', b: 120, ct: 450 },
    { label: 'Ambient Soft', b: 180, ct: 350 },
    { label: 'Focus Work', b: 255, ct: 200 },
  ];

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 ${
      isOn 
        ? 'glass-card-active text-white' 
        : 'glass-card border-white/10 text-white/70 hover:border-white/20 hover:text-white'
    }`}>
      {/* Specular Top Light Ridge */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

      {/* Glow when on */}
      {isOn && (
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
            isOn ? 'bg-amber-500/25 border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-white/5 border-white/10 text-white/50'
          }`}>
            <Lightbulb size={19} />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">Dining Chandelier</h4>
            <p className="text-[11px] text-white/60 font-light">
              {isOn ? `Tuya Smart • ${Math.round((brightness / 255) * 100)}% Brightness` : 'Turned Off'}
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleEntity('light.dining_table_light')}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
            isOn 
              ? 'bg-amber-500/30 border-amber-400/50 text-amber-200 hover:bg-amber-500/40' 
              : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/15 hover:text-white'
          }`}
          title="Toggle Dining Light"
        >
          <Power size={14} />
        </button>
      </div>

      {/* Brightness Slider */}
      <div className="mt-5">
        <div className="flex justify-between text-[11px] text-white/70 mb-1.5">
          <span className="flex items-center space-x-1">
            <Sun size={12} className="text-amber-400" />
            <span>Dimmer Level</span>
          </span>
          <span className="font-mono text-white/90">{Math.round((brightness / 255) * 100)}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="255"
          value={brightness}
          onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
          disabled={!isOn}
          className="w-full h-1.5 rounded-lg appearance-none bg-white/10 accent-amber-400 cursor-pointer disabled:opacity-40"
        />
      </div>

      {/* Warmth Spectrum */}
      <div className="mt-4">
        <div className="flex justify-between text-[11px] text-white/70 mb-1.5">
          <span>Warmth (2700K ➔ 6500K)</span>
          <span className="text-[10px] text-amber-300/80 font-mono">
            {colorTemp > 380 ? 'Cozy Warm' : colorTemp > 280 ? 'Neutral' : 'Daylight Cool'}
          </span>
        </div>
        <input
          type="range"
          min="153"
          max="500"
          value={colorTemp}
          onChange={(e) => handleColorTemp(parseInt(e.target.value))}
          disabled={!isOn}
          className="w-full h-1.5 rounded-lg appearance-none bg-gradient-to-r from-blue-200 via-amber-100 to-amber-500 accent-amber-300 cursor-pointer disabled:opacity-40"
        />
      </div>

      {/* Quick Scene Buttons */}
      <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-1.5">
        {scenes.map((s) => (
          <button
            key={s.label}
            onClick={() => {
              handleBrightnessChange(s.b);
              handleColorTemp(s.ct);
            }}
            disabled={!isOn}
            className="py-1.5 px-1 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-[10px] font-medium text-white/80 hover:text-white transition-all disabled:opacity-30"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
