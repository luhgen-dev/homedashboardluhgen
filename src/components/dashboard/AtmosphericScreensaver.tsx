import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CloudSun, Moon, ShieldCheck, Lock, Unlock, Wind, Droplets } from 'lucide-react';
import { getMoonPhase } from '../../utils/moonPhase';
import { useHomeAssistant } from '../../contexts/HomeAssistantContext';

interface AtmosphericScreensaverProps {
  currentTime: Date;
  displayWeather: string;
  isDimmed: boolean;
  onWake: () => void;
}

export const AtmosphericScreensaver: React.FC<AtmosphericScreensaverProps> = ({
  currentTime,
  displayWeather,
  isDimmed,
  onWake,
}) => {
  const { entities } = useHomeAssistant();

  // Time format
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');

  // Date format: e.g., "Saturday, 12 September"
  const dateStr = currentTime.toLocaleDateString('en-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const moonPhase = getMoonPhase(currentTime);

  // Weather & environment entities
  const weatherEntity = entities['weather.forecast_home'];
  const currentTemp = weatherEntity?.attributes.temperature ?? 30;
  const humidity = weatherEntity?.attributes.humidity ?? 68;
  const lockEntity = entities['lock.front_door'];
  const isLocked = lockEntity?.state === 'locked';
  const hallAC = entities['climate.living_room_hall_ac'];
  const isAcCooling = hallAC?.state === 'cool';
  const indoorTemp = hallAC?.attributes.current_temperature ?? 26.5;

  return (
    <div 
      className={`absolute inset-0 flex flex-col justify-between p-8 sm:p-14 z-20 pointer-events-none transition-all duration-1000 ${
        isDimmed ? 'opacity-45 filter brightness-75' : 'opacity-100'
      }`}
    >
      {/* Top Bar: Subtle Subang Jaya & Moon Glance */}
      <div className="flex items-center justify-between text-white/70">
        <div className="flex items-center space-x-2 text-xs sm:text-sm tracking-widest uppercase font-light">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span>Subang Jaya • Tropic Horizon</span>
        </div>

        {/* Astronomical Moon Phase & Ambient Status */}
        <div className="flex items-center space-x-3 text-xs sm:text-sm font-light text-white/75 bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
          <span className="text-base leading-none">{moonPhase.icon}</span>
          <span className="capitalize">{moonPhase.name}</span>
          <span className="text-white/30">•</span>
          <span>{Math.round(moonPhase.illumination * 100)}% illuminated</span>
        </div>
      </div>

      {/* Central Hero: Architectural Ultra-Clean Digital Typography */}
      <div className="my-auto flex flex-col items-center justify-center text-center relative">
        {/* Subtle luminous halo behind digits */}
        <div className="absolute w-[500px] h-[300px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

        {/* Time with Colon subtle breath */}
        <div 
          className="relative flex items-baseline font-extralight tracking-[-0.06em] text-white tabular-nums drop-shadow-2xl select-none"
          style={{ textShadow: '0 12px 40px rgba(0,0,0,0.7), 0 0 80px rgba(255,255,255,0.08)' }}
        >
          <span className="text-[20vw] sm:text-[15vw] md:text-[13rem] lg:text-[15rem] leading-none font-display font-light">
            {hours}
          </span>
          <span className={`text-[15vw] sm:text-[11vw] md:text-[10rem] lg:text-[12rem] leading-none px-2 text-cyan-300/80 font-display ${isDimmed ? 'opacity-30' : 'animate-pulse'}`}>
            :
          </span>
          <span className="text-[20vw] sm:text-[15vw] md:text-[13rem] lg:text-[15rem] leading-none font-display font-light">
            {minutes}
          </span>
          {!isDimmed && (
            <span className="text-[4vw] sm:text-[2.5vw] md:text-3xl text-cyan-200/50 ml-4 font-mono font-light tracking-normal hidden sm:inline">
              {seconds}
            </span>
          )}
        </div>

        {/* Date pill with subtle typography */}
        <p className="mt-3 sm:mt-5 text-sm sm:text-lg md:text-xl font-light tracking-[0.2em] uppercase text-white/80 drop-shadow-md">
          {dateStr}
        </p>

        {/* Ambient Glance Badges - Top-Tier Specular Glass Rims */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-white/85">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full glass-pill border border-white/15">
            <CloudSun size={15} className="text-amber-300" />
            <span className="font-medium">{currentTemp}°C</span>
            <span className="text-white/30">•</span>
            <span className="capitalize text-white/70">{displayWeather}</span>
          </div>

          <div className="flex items-center space-x-2 px-4 py-2 rounded-full glass-pill border border-white/15">
            <Droplets size={14} className="text-cyan-300" />
            <span>{humidity}% Humidity</span>
          </div>

          <div className="flex items-center space-x-2 px-4 py-2 rounded-full glass-pill border border-white/15">
            <Wind size={14} className={isAcCooling ? 'text-cyan-400 animate-pulse' : 'text-slate-400'} />
            <span>Indoor {indoorTemp}°C</span>
          </div>

          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all ${
            isLocked 
              ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
              : 'bg-amber-500/20 border-amber-400/35 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
          }`}>
            {isLocked ? <Lock size={13} className="text-emerald-300" /> : <Unlock size={13} className="text-amber-300" />}
            <span className="font-medium">{isLocked ? 'Avant Guard: Locked' : 'Door Unlocked'}</span>
          </div>
        </div>
      </div>

      {/* Bottom Glance & Double Tap Cue */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 pt-4 border-t border-white/10">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <Sparkles size={14} className="text-cyan-400 animate-pulse" />
          <span>Aura Home Core • Live Atmosphere Engine</span>
        </div>

        {/* Gentle hint on how to open dashboard */}
        <button
          onClick={onWake}
          className="pointer-events-auto flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-white/80 hover:text-white transition-all text-xs cursor-pointer shadow-lg backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Double-tap screen to unlock controls</span>
        </button>
      </div>
    </div>
  );
};
