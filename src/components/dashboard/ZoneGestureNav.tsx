import React from 'react';
import { motion } from 'motion/react';
import { 
  Tv, 
  Utensils, 
  Flame, 
  Bed, 
  SunMedium, 
  LayoutGrid, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
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

interface ZoneGestureNavProps {
  onOpenMatrixHUD: () => void;
  onNextZone: () => void;
  onPrevZone: () => void;
}

export const ZoneGestureNav: React.FC<ZoneGestureNavProps> = ({
  onOpenMatrixHUD,
  onNextZone,
  onPrevZone,
}) => {
  const { activeZoneId, setActiveZoneId, entities } = useHomeAssistant();

  const currentIndex = ZONES.findIndex((z) => z.id === activeZoneId);

  // Count active devices for a given zone
  const getActiveDeviceCount = (entityIds: string[]) => {
    return entityIds.filter((id) => {
      const ent = entities[id];
      if (!ent) return false;
      return ent.state === 'on' || ent.state === 'playing' || ent.state === 'cool' || ent.state === 'open';
    }).length;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 pb-4 sm:pb-5 z-20 pointer-events-auto select-none">
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Left Arrow (Previous Zone) */}
        <button
          onClick={onPrevZone}
          className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-white/60 hover:text-white border border-white/10 hover:border-white/20 active:scale-95 transition-all cursor-pointer"
          title="Swipe Right / Previous Room"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Minimal Floating Hairline Zone Indicator Bar */}
        <div className="flex items-center space-x-2.5 px-4 py-2 rounded-full glass-dock border border-white/15 shadow-2xl">
          {ZONES.map((zone, idx) => {
            const isActive = activeZoneId === zone.id;
            const activeCount = getActiveDeviceCount(zone.entityIds);
            const Icon = getZoneIcon(zone.iconName);

            return (
              <button
                key={zone.id}
                onClick={() => setActiveZoneId(zone.id)}
                className={`group relative flex items-center transition-all duration-300 rounded-full cursor-pointer ${
                  isActive ? 'px-3 py-1 bg-white/15 border border-white/25 text-white' : 'p-1.5 text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
                title={`${zone.name} (${activeCount > 0 ? `${activeCount} Active` : 'Quiet'})`}
              >
                <div className="flex items-center space-x-1.5">
                  <Icon size={14} className={isActive ? 'text-cyan-300' : ''} />
                  {isActive && (
                    <span className="text-xs font-medium tracking-wide whitespace-nowrap">
                      {zone.name.split(' ')[0]}
                    </span>
                  )}
                </div>

                {/* Subtle active device ping on dormant pills */}
                {!isActive && activeCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Arrow (Next Zone) */}
        <button
          onClick={onNextZone}
          className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-white/60 hover:text-white border border-white/10 hover:border-white/20 active:scale-95 transition-all cursor-pointer"
          title="Swipe Left / Next Room"
        >
          <ChevronRight size={16} />
        </button>

        {/* Long Press / Quick Jump Matrix Simulation Trigger */}
        <button
          onClick={onOpenMatrixHUD}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-pill hover:bg-white/15 active:scale-95 border border-cyan-400/30 text-cyan-200 hover:text-white text-xs font-medium transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          title="Zone Matrix Quick Jump (or Long Press anywhere for 0.5s)"
        >
          <LayoutGrid size={13} className="text-cyan-400" />
          <span className="hidden sm:inline">Zone Matrix</span>
          <span className="text-[10px] text-cyan-300/60 font-mono hidden md:inline">Hold 0.5s</span>
        </button>
      </div>

      {/* Discreet Gesture Hint for iPad */}
      <div className="mt-2 text-[11px] text-white/40 tracking-wider font-light flex items-center space-x-2">
        <span>← Swipe Left / Right to traverse rooms →</span>
      </div>
    </div>
  );
};
