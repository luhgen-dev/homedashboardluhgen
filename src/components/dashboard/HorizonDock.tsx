import React from 'react';
import { Tv, Utensils, Flame, Bed, SunMedium } from 'lucide-react';
import { useHomeAssistant, ZONES } from '../../contexts/HomeAssistantContext';

const getZoneIcon = (iconName: string) => {
  switch (iconName) {
    case 'Tv': return Tv;
    case 'Utensils': return Utensils;
    case 'Flame': return Flame;
    case 'Bed': return Bed;
    case 'SunMedium': return SunMedium;
    default: return Tv;
  }
};

export const HorizonDock: React.FC = () => {
  const { activeZoneId, setActiveZoneId, entities } = useHomeAssistant();

  // Helper to count active devices in a zone
  const getActiveDeviceCount = (entityIds: string[]) => {
    return entityIds.filter((id) => {
      const ent = entities[id];
      if (!ent) return false;
      return ent.state === 'on' || ent.state === 'playing' || ent.state === 'cool' || ent.state === 'open';
    }).length;
  };

  return (
    <div className="w-full flex justify-center px-4 pb-5 z-20 pointer-events-auto">
      <div className="flex items-center space-x-2 sm:space-x-3 p-1.5 rounded-2xl glass-dock border border-white/15 shadow-2xl overflow-x-auto hide-scrollbar max-w-full">
        {ZONES.map((zone) => {
          const isActive = activeZoneId === zone.id;
          const activeCount = getActiveDeviceCount(zone.entityIds);
          const Icon = getZoneIcon(zone.iconName);

          return (
            <button
              key={zone.id}
              onClick={() => setActiveZoneId(zone.id)}
              className={`relative flex items-center space-x-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 text-left shrink-0 cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-white/15 border border-white/30 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                  : 'bg-transparent border border-transparent text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {/* Active count cyan indicator */}
              {activeCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                </span>
              )}

              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                isActive ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/30' : 'bg-white/5 text-white/60 border border-white/5'
              }`}>
                <Icon size={16} />
              </div>

              <div>
                <p className="text-xs font-medium tracking-wide whitespace-nowrap">
                  {zone.name}
                </p>
                <p className="text-[10px] text-white/45 whitespace-nowrap font-light">
                  {activeCount > 0 ? (
                    <span className="text-cyan-300 font-medium">{activeCount} Active</span>
                  ) : (
                    'Quiet'
                  )}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
