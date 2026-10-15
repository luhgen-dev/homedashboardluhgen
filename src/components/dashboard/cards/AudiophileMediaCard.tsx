import React from 'react';
import { Tv, Volume2, VolumeX, Play, Pause, Disc, Sparkles, ChevronRight, Speaker } from 'lucide-react';
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext';

export const AudiophileMediaCard: React.FC<{ onExpand: () => void }> = ({ onExpand }) => {
  const { entities, callService, toggleEntity } = useHomeAssistant();
  
  const tv = entities['media_player.living_room_lg_tv'];
  const soundbar = entities['media_player.lg_speaker_s95tr'];
  const appleTv = entities['media_player.living_room_living_room'];

  const isTvOn = tv?.state === 'on';
  const isPlaying = appleTv?.state === 'playing';
  const volumeLevel = soundbar?.attributes.volume_level ?? 0.4;
  const isMuted = soundbar?.attributes.is_volume_muted ?? false;
  const soundMode = soundbar?.attributes.sound_mode ?? 'Dolby Atmos';

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    callService('media_player', 'volume_set', {
      entity_id: 'media_player.lg_speaker_s95tr',
      volume_level: val
    });
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    callService('media_player', 'volume_mute', {
      entity_id: 'media_player.lg_speaker_s95tr',
      is_volume_muted: !isMuted
    });
  };

  const togglePlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    callService('media_player', isPlaying ? 'media_pause' : 'media_play', {
      entity_id: 'media_player.living_room_living_room'
    });
  };

  return (
    <div 
      onClick={onExpand}
      className={`group relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 cursor-pointer ${
        isTvOn 
          ? 'glass-card-active text-white' 
          : 'glass-card border-white/10 text-white/70 hover:border-white/20 hover:text-white'
      }`}
    >
      {/* Specular Top Light Ridge */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

      {/* Background glow when active */}
      {isTvOn && (
        <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      )}

      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
            isTvOn ? 'bg-indigo-500/25 border-indigo-400/40 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-white/5 border-white/10 text-white/50'
          }`}>
            <Tv size={19} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold tracking-wide text-white">LG Cinema Stage</h4>
              {isTvOn && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {soundMode.includes('Atmos') ? 'Atmos' : 'Cinema'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/60 font-light">
              {isTvOn ? (tv?.attributes.source ?? 'Apple TV 4K') : 'Power Off'}
            </p>
          </div>
        </div>

        {/* Master TV & Soundbar Power */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleEntity('media_player.living_room_lg_tv');
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
            isTvOn 
              ? 'bg-indigo-500/30 border-indigo-400/50 text-indigo-200 hover:bg-indigo-500/45' 
              : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/15 hover:text-white'
          }`}
          title="Toggle TV & Soundbar"
        >
          <Tv size={14} />
        </button>
      </div>

      {/* Now Playing or Standby Content */}
      <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
            isPlaying ? 'bg-indigo-600/30 border-indigo-500/40 text-indigo-300' : 'bg-white/5 border-white/10 text-white/40'
          }`}>
            <Disc size={18} className={isPlaying ? 'animate-spin-slow text-indigo-400' : ''} />
          </div>
          <div className="truncate">
            <p className="text-xs font-medium text-white truncate">
              {appleTv?.attributes.media_title ?? 'Apple TV Standby'}
            </p>
            <p className="text-[11px] text-white/50 truncate">
              {appleTv?.attributes.media_artist ?? 'Ready for AirPlay / Streaming'}
            </p>
          </div>
        </div>

        {isTvOn && (
          <button
            onClick={togglePlayback}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-95 text-white shrink-0 ml-2"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>
        )}
      </div>

      {/* S95TR Soundbar Master Volume Scrub Bar */}
      <div className="mt-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between text-[11px] text-white/70 mb-1.5">
          <span className="flex items-center space-x-1">
            <Speaker size={12} className="text-indigo-400" />
            <span>LG S95TR Master Volume</span>
          </span>
          <span className="font-mono text-white/90">{Math.round(volumeLevel * 100)}%</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
              isMuted ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
            }`}
            title="Toggle Mute"
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={volumeLevel}
            onChange={handleVolumeChange}
            disabled={!isTvOn}
            className="w-full h-1.5 rounded-lg appearance-none bg-white/10 accent-indigo-400 cursor-pointer disabled:opacity-40"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
        <span>Audio Mode: <strong className="text-white/80 font-normal">{soundMode}</strong></span>
        <span className="flex items-center space-x-0.5 text-indigo-300 group-hover:translate-x-0.5 transition-transform">
          <span>Audio Suite</span>
          <ChevronRight size={12} />
        </span>
      </div>
    </div>
  );
};
