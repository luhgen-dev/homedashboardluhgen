import React from 'react';
import { Columns, Sun, Sliders, ArrowLeftRight } from 'lucide-react';
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext';

export const SheerCurtainCard: React.FC<{ onExpand: () => void }> = ({ onExpand }) => {
  const { entities, callService } = useHomeAssistant();
  const curtain = entities['cover.living_room_vertical_curtain'];

  if (!curtain) return null;

  const position = curtain.attributes.current_position ?? 75; // Traverse (0 = closed, 100 = open)
  const tiltPosition = curtain.attributes.current_tilt_position ?? 60; // Louver tilt (0 to 90)

  const setTraverse = (pos: number, e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    callService('cover', 'set_cover_position', {
      entity_id: 'cover.living_room_vertical_curtain',
      position: pos
    });
  };

  const setTilt = (tilt: number, e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    callService('cover', 'set_cover_tilt_position', {
      entity_id: 'cover.living_room_vertical_curtain',
      tilt_position: tilt
    });
  };

  return (
    <div 
      onClick={onExpand}
      className="group relative overflow-hidden rounded-2xl p-5 border glass-card border-white/10 transition-all duration-300 cursor-pointer text-white hover:border-white/25"
    >
      {/* Specular Top Light Ridge */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-500/20 border border-teal-400/35 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.25)]">
            <Columns size={19} />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">Vertical Sheer Curtain</h4>
            <p className="text-[11px] text-white/60 font-light">
              Traverse: {position}% • Louver Tilt: {tiltPosition}°
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => setTraverse(0, e)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
              position === 0 ? 'bg-white/20 border-white/30 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            Drawn
          </button>
          <button
            onClick={(e) => setTraverse(100, e)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
              position === 100 ? 'bg-white/20 border-white/30 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            Open
          </button>
        </div>
      </div>

      {/* Visual Curtain Vanes Simulation */}
      <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between h-14 overflow-hidden rounded-lg bg-black/40 px-3 relative">
          {/* Simulated Vertical Vanes */}
          {Array.from({ length: 12 }).map((_, i) => {
            const isGathered = i > (position / 100) * 12;
            return (
              <div
                key={i}
                className="h-full w-1.5 rounded-sm transition-all duration-500 bg-white/70 shadow-sm"
                style={{
                  transform: `rotateY(${tiltPosition * 0.9}deg) ${isGathered ? 'scaleY(0.9) opacity(0.3)' : 'opacity(0.85)'}`,
                  marginRight: isGathered ? '1px' : 'auto',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Two Axis Controls */}
      <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
        {/* Traverse Slider (Horizontal Draw) */}
        <div>
          <div className="flex justify-between text-[11px] text-white/70 mb-1">
            <span className="flex items-center space-x-1">
              <ArrowLeftRight size={11} className="text-teal-400" />
              <span>Traverse Draw (Open / Closed)</span>
            </span>
            <span className="font-mono text-white/90">{position}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={(e) => setTraverse(parseInt(e.target.value), e)}
            className="w-full h-1.5 rounded-lg appearance-none bg-white/10 accent-teal-400 cursor-pointer"
          />
        </div>

        {/* Louver Tilt Slider */}
        <div>
          <div className="flex justify-between text-[11px] text-white/70 mb-1">
            <span className="flex items-center space-x-1">
              <Sun size={11} className="text-amber-400" />
              <span>Vane Tilt (Daylight Filter)</span>
            </span>
            <span className="font-mono text-white/90">{tiltPosition}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            value={tiltPosition}
            onChange={(e) => setTilt(parseInt(e.target.value), e)}
            className="w-full h-1.5 rounded-lg appearance-none bg-white/10 accent-amber-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
