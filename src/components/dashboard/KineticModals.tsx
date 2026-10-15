import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ThermometerSnowflake, Wind, Volume2, VolumeX, 
  Tv, Disc, Sliders, Columns, Sun, Sparkles, Check
} from 'lucide-react';
import { useHomeAssistant } from '../../contexts/HomeAssistantContext';

interface KineticModalsProps {
  entityId: string | null;
  onClose: () => void;
}

export const KineticModals: React.FC<KineticModalsProps> = ({ entityId, onClose }) => {
  const { entities, callService, setEntityAttribute } = useHomeAssistant();

  if (!entityId) return null;
  const entity = entities[entityId];
  if (!entity) return null;

  const isClimate = entityId.startsWith('climate.');
  const isMedia = entityId.includes('speaker') || entityId.includes('lg_tv');
  const isCurtain = entityId.startsWith('cover.');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
        {/* Backdrop blur overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-3xl bg-slate-950/80 border border-white/20 p-6 shadow-2xl backdrop-blur-2xl text-white overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
          >
            <X size={16} />
          </button>

          {/* 1. CLIMATE MODAL (Haier Hall AC or Bedroom AC) */}
          {isClimate && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
                  Climate Intelligence
                </span>
                <h3 className="text-xl font-medium text-white mt-0.5">
                  {entity.attributes.friendly_name || 'Air Conditioner'}
                </h3>
              </div>

              {/* Large Temperature Arc Display */}
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-44 h-44 rounded-full border-4 border-cyan-500/30 flex flex-col items-center justify-center bg-cyan-950/20 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
                  <span className="text-5xl font-light tracking-tight text-white tabular-nums">
                    {entity.attributes.temperature ?? 24}
                  </span>
                  <span className="text-xs font-medium text-cyan-300 uppercase tracking-widest mt-1">
                    Target °C
                  </span>
                </div>

                {/* Temperature Adjustment Buttons */}
                <div className="flex items-center space-x-4 mt-5">
                  <button
                    onClick={() => {
                      const cur = entity.attributes.temperature ?? 24;
                      callService('climate', 'set_temperature', {
                        entity_id: entityId,
                        temperature: Math.max(16, cur - 1)
                      });
                    }}
                    className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-2xl font-light flex items-center justify-center border border-white/10"
                  >
                    -
                  </button>
                  <span className="text-xs text-white/60">
                    Ambient: {entity.attributes.current_temperature ?? 26}°C
                  </span>
                  <button
                    onClick={() => {
                      const cur = entity.attributes.temperature ?? 24;
                      callService('climate', 'set_temperature', {
                        entity_id: entityId,
                        temperature: Math.min(30, cur + 1)
                      });
                    }}
                    className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-2xl font-light flex items-center justify-center border border-white/10"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* HVAC Mode Selectors */}
              <div>
                <label className="text-xs text-white/60 uppercase tracking-wider block mb-2">
                  Operating Mode
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['cool', 'fan_only', 'auto', 'off'].map((mode) => {
                    const isSelected = entity.state === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => {
                          callService('climate', mode === 'off' ? 'turn_off' : 'set_hvac_mode', {
                            entity_id: entityId,
                            hvac_mode: mode
                          });
                        }}
                        className={`py-2 px-1 rounded-xl text-xs font-medium border text-center capitalize transition-all ${
                          isSelected
                            ? 'bg-cyan-500/30 border-cyan-400/50 text-cyan-200'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {mode.replace('_', ' ')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fan Speeds */}
              <div>
                <label className="text-xs text-white/60 uppercase tracking-wider block mb-2">
                  Inverter Fan Speed
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['quiet', 'low', 'medium', 'high', 'turbo', 'auto'].map((fMode) => {
                    const isSelected = entity.attributes.fan_mode === fMode;
                    return (
                      <button
                        key={fMode}
                        onClick={() => {
                          setEntityAttribute(entityId, { fan_mode: fMode });
                        }}
                        className={`py-2 px-1 rounded-xl text-xs font-medium border text-center capitalize transition-all ${
                          isSelected
                            ? 'bg-white/20 border-white/40 text-white'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {fMode}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. AUDIOPHILE & SOUNDBAR S95TR MODAL */}
          {isMedia && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                  Acoustic Engineering
                </span>
                <h3 className="text-xl font-medium text-white mt-0.5">
                  LG S95TR (9.1.5 Channel Dolby Atmos)
                </h3>
              </div>

              {/* Volume Master Slider */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex justify-between text-xs text-white/70 mb-2">
                  <span className="flex items-center space-x-1.5">
                    <Volume2 size={15} className="text-indigo-400" />
                    <span>Reference Master Volume</span>
                  </span>
                  <span className="font-mono text-white text-sm">
                    {Math.round((entity.attributes.volume_level ?? 0.4) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={entity.attributes.volume_level ?? 0.4}
                  onChange={(e) => {
                    callService('media_player', 'volume_set', {
                      entity_id: 'media_player.lg_speaker_s95tr',
                      volume_level: parseFloat(e.target.value)
                    });
                  }}
                  className="w-full h-2 rounded-lg appearance-none bg-white/10 accent-indigo-400 cursor-pointer"
                />
              </div>

              {/* Sound Mode Profiles */}
              <div>
                <label className="text-xs text-white/60 uppercase tracking-wider block mb-2">
                  Sound Field Processing
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Dolby Atmos Cinema',
                    'AI Sound Pro',
                    'Standard Studio',
                    'Clear Voice Pro',
                    'Bass Blast +'
                  ].map((mode) => {
                    const isSelected = (entity.attributes.sound_mode || '').includes(mode.split(' ')[0]);
                    return (
                      <button
                        key={mode}
                        onClick={() => {
                          setEntityAttribute(entityId, { sound_mode: mode });
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-400/50 text-indigo-200'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{mode}</span>
                        {isSelected && <Check size={14} className="text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 3. SHEER CURTAIN MODAL */}
          {isCurtain && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-teal-400 font-semibold">
                  Architectural Glazing
                </span>
                <h3 className="text-xl font-medium text-white mt-0.5">
                  Vertical Sheer Curtain
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-white/70 mb-1.5">
                    <span>Traverse (Draw Percentage)</span>
                    <span className="font-mono text-white">
                      {entity.attributes.current_position ?? 75}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={entity.attributes.current_position ?? 75}
                    onChange={(e) => {
                      callService('cover', 'set_cover_position', {
                        entity_id: entityId,
                        position: parseInt(e.target.value)
                      });
                    }}
                    className="w-full h-2 rounded-lg appearance-none bg-white/10 accent-teal-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-white/70 mb-1.5">
                    <span>Louver Vane Tilt Angle</span>
                    <span className="font-mono text-white">
                      {entity.attributes.current_tilt_position ?? 60}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={entity.attributes.current_tilt_position ?? 60}
                    onChange={(e) => {
                      callService('cover', 'set_cover_tilt_position', {
                        entity_id: entityId,
                        tilt_position: parseInt(e.target.value)
                      });
                    }}
                    className="w-full h-2 rounded-lg appearance-none bg-white/10 accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
