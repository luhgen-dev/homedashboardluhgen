import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tv, 
  Utensils, 
  Flame, 
  Bed, 
  SunMedium, 
  X, 
  Check, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useHomeAssistant, ZONES } from '../../contexts/HomeAssistantContext';

interface ZoneMatrixHUDProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export const ZoneMatrixHUD: React.FC<ZoneMatrixHUDProps> = ({ isOpen, onClose }) => {
  const { activeZoneId, setActiveZoneId, entities } = useHomeAssistant();

  // Helper to count active devices
  const getActiveDeviceCount = (entityIds: string[]) => {
    return entityIds.filter((id) => {
      const ent = entities[id];
      if (!ent) return false;
      return ent.state === 'on' || ent.state === 'playing' || ent.state === 'cool' || ent.state === 'open';
    }).length;
  };

  const handleSelectZone = (zoneId: string) => {
    setActiveZoneId(zoneId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
          {/* Backdrop Blur with organic deep vignetting */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-2xl"
          />

          {/* Holographic Matrix Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 glass-dock border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.8)] z-10 overflow-hidden"
          >
            {/* Top Specular Ridge */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-cyan-300 font-semibold mb-1">
                  <Sparkles size={13} className="animate-pulse" />
                  <span>Subang Jaya Horizon</span>
                </div>
                <h3 className="text-2xl font-light font-display text-white tracking-tight">
                  Architectural Zone Matrix
                </h3>
                <p className="text-xs text-white/60 font-light mt-0.5">
                  Select or tap any zone to jump immediately
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-white/70 hover:text-white border border-white/15 transition-all active:scale-95 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Matrix of 5 Zones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {ZONES.map((zone, index) => {
                const isActive = activeZoneId === zone.id;
                const activeCount = getActiveDeviceCount(zone.entityIds);
                const Icon = getZoneIcon(zone.iconName);

                return (
                  <motion.button
                    key={zone.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectZone(zone.id)}
                    className={`relative flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden ${
                      isActive
                        ? 'glass-card-active border-cyan-400/40 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                        : 'glass-card border-white/10 hover:border-white/25 hover:bg-white/10'
                    }`}
                  >
                    {/* Active Edge Halo */}
                    {isActive && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    )}

                    <div className="flex items-center space-x-3.5 pl-1">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                        isActive
                          ? 'bg-cyan-500/25 border-cyan-400/40 text-cyan-300'
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}>
                        <Icon size={20} />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-white/40 font-mono">0{index + 1}</span>
                          <h4 className="text-sm font-semibold tracking-wide text-white">
                            {zone.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-white/55 font-light line-clamp-1 mt-0.5">
                          {zone.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Active Device Badge or Check */}
                    <div className="flex items-center space-x-2 shrink-0 ml-2">
                      {activeCount > 0 ? (
                        <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span>{activeCount} Active</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-white/35 font-light">
                          Quiet
                        </span>
                      )}

                      {isActive && (
                        <div className="w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Bottom Tip for iPad Gesture Navigation */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
              <span>Touch Gestures: Swipe left / right to cycle rooms</span>
              <span className="hidden sm:inline">Press & hold anywhere for 0.5s to reopen</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
