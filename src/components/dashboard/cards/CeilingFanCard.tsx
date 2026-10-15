import React from 'react';
import { Fan, Power, Wind } from 'lucide-react';
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext';

export const CeilingFanCard: React.FC<{
  entityId?: string;
  title?: string;
  subtitle?: string;
}> = ({ 
  entityId = 'fan.hall_ceiling_fan', 
  title = 'Hall Ceiling Fan',
  subtitle = 'DC Inverter • Gentle Breeze'
}) => {
  const { entities, callService, toggleEntity } = useHomeAssistant();
  const fan = entities[entityId];

  if (!fan) return null;

  const isOn = fan.state === 'on';
  const percentage = fan.attributes.percentage ?? 0;

  const setSpeed = (pct: number, e: React.MouseEvent) => {
    e.stopPropagation();
    callService('fan', 'set_percentage', {
      entity_id: entityId,
      percentage: pct
    });
  };

  // Speed level 0, 1, 2, 3
  const speedLevels = [
    { label: 'Off', pct: 0 },
    { label: '1 (Low)', pct: 33 },
    { label: '2 (Med)', pct: 66 },
    { label: '3 (Turbo)', pct: 100 }
  ];

  // Dynamic animation duration based on percentage
  const spinSpeed = percentage === 100 ? '0.6s' : percentage === 66 ? '1.2s' : percentage === 33 ? '2.2s' : '0s';

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
            isOn ? 'bg-teal-500/25 border-teal-400/40 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'bg-white/5 border-white/10 text-white/50'
          }`}>
            <Fan 
              size={20} 
              style={{ 
                animation: isOn ? `spin ${spinSpeed} linear infinite` : 'none' 
              }} 
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">{title}</h4>
            <p className="text-[11px] text-white/60 font-light">
              {isOn ? `${percentage}% Speed • Circulating` : subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleEntity(entityId)}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
            isOn 
              ? 'bg-teal-500/30 border-teal-400/50 text-teal-200 hover:bg-teal-500/40' 
              : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/15 hover:text-white'
          }`}
          title="Toggle Fan"
        >
          <Power size={14} />
        </button>
      </div>

      {/* Speed Selector Pills */}
      <div className="mt-5 grid grid-cols-4 gap-1.5">
        {speedLevels.map((lvl) => {
          const isSelected = isOn ? percentage === lvl.pct : lvl.pct === 0;
          return (
            <button
              key={lvl.pct}
              onClick={(e) => setSpeed(lvl.pct, e)}
              className={`py-2 px-1 rounded-xl text-xs font-medium border text-center transition-all ${
                isSelected
                  ? 'bg-teal-500/25 border-teal-400/50 text-teal-200 shadow-sm'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {lvl.label}
            </button>
          );
        })}
      </div>

      {/* CSS Spin Keyframe */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
