import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Lock, Unlock, 
  Settings, Power, Radio, CloudSun,
  Activity, UserCheck, Flame, Moon
} from 'lucide-react';
import { useHomeAssistant } from '../../contexts/HomeAssistantContext';

interface GlobalHeaderProps {
  onOpenSettings: () => void;
  onOpenAllOffConfirm: () => void;
  displayWeather: string;
  onSleep?: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ 
  onOpenSettings, 
  onOpenAllOffConfirm,
  displayWeather,
  onSleep
}) => {
  const { entities, toggleEntity, isConnected, isDemoMode } = useHomeAssistant();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDateStr(now.toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const lockEntity = entities['lock.front_door'];
  const isLocked = lockEntity?.state === 'locked';

  const gasEntity = entities['binary_sensor.kitchen_gas_detector'];
  const isGasSafe = gasEntity?.state === 'off';

  const presenceEntity = entities['binary_sensor.hall_presence'];
  const isPresent = presenceEntity?.state === 'on';

  const weatherEntity = entities['weather.forecast_home'];
  const currentTemp = weatherEntity?.attributes.temperature ?? 30;

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 z-20 pointer-events-auto">
      {/* Left: Atmospheric Clock & Weather Glance */}
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <div className="flex items-baseline space-x-2.5">
            <span 
              className="text-3xl font-light font-display tracking-tight text-white tabular-nums drop-shadow-md"
              style={{ textShadow: '0 2px 14px rgba(0,0,0,0.5)' }}
            >
              {timeStr}
            </span>
            <span className="text-xs font-semibold text-cyan-200/80 uppercase tracking-widest">
              {dateStr}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full glass-pill border border-white/15 text-[11px] text-white/90">
              <CloudSun size={12} className="text-amber-300" />
              <span className="font-medium">{currentTemp}°C</span>
              <span className="text-white/40">•</span>
              <span className="capitalize text-white/80">{displayWeather}</span>
            </div>
            <div className="text-[11px] text-white/60 tracking-wider uppercase font-light">
              Subang Jaya
            </div>
          </div>
        </div>
      </div>

      {/* Center: Home Perimeter & Safety Status Strip */}
      <div className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-dock border border-white/15 shadow-xl">
        {/* Front Door Lock (Avant Guard) */}
        <button
          onClick={() => toggleEntity('lock.front_door')}
          className={`flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
            isLocked 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
              : 'bg-amber-500/25 text-amber-300 border border-amber-400/40 hover:bg-amber-500/35 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.25)]'
          }`}
          title="Click to toggle front door lock"
        >
          {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
          <span>{isLocked ? 'Avant Guard: Locked' : 'Door Unlocked'}</span>
        </button>

        {/* Presence */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 text-white/80 text-xs border border-white/10">
          <UserCheck size={12} className={isPresent ? 'text-teal-300' : 'text-slate-400'} />
          <span>{isPresent ? 'Occupied (Lincukoo)' : 'No Motion'}</span>
        </div>

        {/* Gas Detector Safety */}
        <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs border transition-all ${
          isGasSafe 
            ? 'bg-white/5 text-white/75 border-white/10' 
            : 'bg-rose-500/30 text-rose-200 border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-pulse'
        }`}>
          <Flame size={12} className={isGasSafe ? 'text-emerald-400' : 'text-rose-400'} />
          <span>{isGasSafe ? 'Gas: Secure' : 'GAS ALERT'}</span>
        </div>
      </div>

      {/* Right: HA Status, Master Off, Settings */}
      <div className="flex items-center space-x-2.5">
        {/* Home Assistant Status Badge */}
        <button
          onClick={onOpenSettings}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border backdrop-blur-md transition-all ${
            isConnected
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : isDemoMode
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30 hover:bg-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
              : 'bg-rose-500/20 text-rose-300 border-rose-400/30 hover:bg-rose-500/30'
          }`}
          title="Home Assistant Connection"
        >
          <Radio size={12} className={isConnected ? 'animate-pulse text-emerald-400' : ''} />
          <span>{isConnected ? 'HA Live' : isDemoMode ? 'HA Sim' : 'HA Offline'}</span>
        </button>

        {/* Master All-Off Action */}
        <button
          onClick={onOpenAllOffConfirm}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 hover:text-white border border-rose-500/30 backdrop-blur-md text-xs font-medium transition-all shadow-md active:scale-95 hover:shadow-[0_0_15px_rgba(244,63,94,0.25)]"
          title="Turn off active appliances"
        >
          <Power size={13} />
          <span className="hidden sm:inline font-medium">Goodnight</span>
        </button>

        {/* Settings / Gear */}
        <button
          onClick={onOpenSettings}
          className="w-8 h-8 rounded-full flex items-center justify-center glass-pill hover:bg-white/20 text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all active:scale-95"
          title="Dashboard & HA Settings"
        >
          <Settings size={15} />
        </button>

        {/* Back to Screensaver Button */}
        {onSleep && (
          <button
            onClick={onSleep}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 hover:text-white border border-cyan-400/30 backdrop-blur-md text-xs font-medium transition-all shadow-md active:scale-95 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            title="Return to Screensaver Clock"
          >
            <Moon size={13} className="text-cyan-300" />
            <span className="hidden sm:inline font-medium">Clock</span>
          </button>
        )}
      </div>
    </header>
  );
};
