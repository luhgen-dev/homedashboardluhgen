import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Power, Check, X } from "lucide-react";
import { WeatherCondition } from "../components/AmbientWeather";
import { Weather3D } from "../components/Weather3D";
import { getMoonPhase } from "../utils/moonPhase";
import { 
  HomeAssistantProvider, 
  useHomeAssistant,
  ZONES 
} from "../contexts/HomeAssistantContext";
import { GlobalHeader } from "../components/dashboard/GlobalHeader";
import { ZoneCoverflow } from "../components/dashboard/ZoneCoverflow";
import { ZoneGestureNav } from "../components/dashboard/ZoneGestureNav";
import { ZoneMatrixHUD } from "../components/dashboard/ZoneMatrixHUD";
import { WeatherToy } from "../components/dashboard/WeatherToy";
import { KineticModals } from "../components/dashboard/KineticModals";
import { SettingsModal } from "../components/dashboard/SettingsModal";
import { AtmosphericScreensaver } from "../components/dashboard/AtmosphericScreensaver";

type RippleType = 'main' | 'hint';
interface Ripple {
  id: number;
  x: number;
  y: number;
  type: RippleType;
}

const DashboardContent: React.FC = () => {
  const { 
    entities, 
    callService, 
    selectedModalEntityId, 
    setSelectedModalEntityId,
    activeZoneId,
    setActiveZoneId
  } = useHomeAssistant();

  // Weather & Atmosphere State
  const [realWeather, setRealWeather] = useState<WeatherCondition>('sunny');
  const [vibe, setVibe] = useState<WeatherCondition | 'auto'>('auto');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Screensaver & Power State (Default is screensaver as requested)
  const [isScreensaver, setIsScreensaver] = useState(true);
  const [isDimmed, setIsDimmed] = useState(false);
  const lastInteractionRef = useRef<number>(Date.now());
  const lastTapRef = useRef<number>(0);

  // Zone Matrix HUD (Quick Jump modal opened via 500ms long press or simulation button)
  const [isZoneMatrixOpen, setIsZoneMatrixOpen] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAllOffOpen, setIsAllOffOpen] = useState(false);

  // Water Ripple Engine
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = (x: number, y: number, type: RippleType = 'main') => {
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y, type }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 2800);
  };

  // Next / Previous Zone helpers
  const handleNextZone = () => {
    const idx = ZONES.findIndex((z) => z.id === activeZoneId);
    const nextIdx = (idx + 1) % ZONES.length;
    setActiveZoneId(ZONES[nextIdx].id);
  };

  const handlePrevZone = () => {
    const idx = ZONES.findIndex((z) => z.id === activeZoneId);
    const prevIdx = (idx - 1 + ZONES.length) % ZONES.length;
    setActiveZoneId(ZONES[prevIdx].id);
  };

  // Start Long Press Timer (500ms)
  const startLongPress = (x: number, y: number) => {
    if (isScreensaver) return;
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);

    longPressTimerRef.current = setTimeout(() => {
      setIsZoneMatrixOpen(true);
      addRipple(x, y, 'hint');
    }, 500);
  };

  // Cancel Long Press Timer
  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Wake function to transition smoothly from screensaver to full controls
  const wakeDashboard = (x?: number, y?: number) => {
    setIsScreensaver(false);
    setIsDimmed(false);
    lastInteractionRef.current = Date.now();
    if (x !== undefined && y !== undefined) {
      addRipple(x, y, 'main');
    }
  };

  // Put dashboard back to screensaver
  const sleepDashboard = () => {
    setIsScreensaver(true);
    lastInteractionRef.current = Date.now();
  };

  // Double-tap or double-click anywhere on the screen
  const handleContainerClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    // Trigger water ripple effect always
    addRipple(e.clientX, e.clientY, 'main');
    lastInteractionRef.current = now;

    if (isScreensaver) {
      // Double tap detected (within 380ms)
      if (timeSinceLastTap > 0 && timeSinceLastTap < 380) {
        wakeDashboard(e.clientX, e.clientY);
        lastTapRef.current = 0;
        return;
      }
      // If single tap while screensaver is dimmed, undim it
      if (isDimmed) {
        setIsDimmed(false);
      }
    } else {
      // While active, undim on interaction
      setIsDimmed(false);
    }

    lastTapRef.current = now;
  };

  // Touch handlers for mobile/iPad touch screens
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch && !isScreensaver) {
      startLongPress(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = () => {
    cancelLongPress();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    cancelLongPress();
    const touch = e.changedTouches[0];
    if (!touch) return;
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    lastInteractionRef.current = now;

    if (isScreensaver) {
      if (timeSinceLastTap > 0 && timeSinceLastTap < 380) {
        wakeDashboard(touch.clientX, touch.clientY);
        lastTapRef.current = 0;
        return;
      }
      if (isDimmed) {
        setIsDimmed(false);
      }
    }

    lastTapRef.current = now;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isScreensaver) {
      startLongPress(e.clientX, e.clientY);
    }
  };

  const handleMouseMove = () => {
    cancelLongPress();
  };

  const handleMouseUp = () => {
    cancelLongPress();
  };

  // Idle timer for iPad battery saving:
  // 1) If in active dashboard controls mode, after 2 minutes of no touches -> return to screensaver
  // 2) If in screensaver mode, after 45 seconds of no touches -> enter deep dimmed state & throttled animations
  useEffect(() => {
    const idleCheckInterval = setInterval(() => {
      const idleTime = Date.now() - lastInteractionRef.current;

      if (!isScreensaver) {
        // Return to screensaver after 120s of inactivity
        if (idleTime > 120000) {
          setIsScreensaver(true);
        }
      } else {
        // In screensaver: dim screen after 45s of inactivity
        if (idleTime > 45000 && !isDimmed) {
          setIsDimmed(true);
        }
      }
    }, 3000);

    return () => clearInterval(idleCheckInterval);
  }, [isScreensaver, isDimmed]);

  // Clock & astronomical moon phase
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const moonPhase = getMoonPhase(currentTime);

  // Golden Hour check
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  const isGoldenHour = (hour === 18 && minute >= 30) || (hour === 19 && minute <= 30);

  const activeBackground = vibe === 'auto' ? realWeather : vibe;
  const displayWeather = (activeBackground === 'sunny' && isGoldenHour) ? 'sunset' : activeBackground;

  // Master All Off routine
  const executeMasterAllOff = () => {
    // Turn off ACs
    callService('climate', 'turn_off', { entity_id: 'climate.living_room_hall_ac' });
    callService('climate', 'turn_off', { entity_id: 'climate.bedroom_ac' });
    // Turn off media
    callService('media_player', 'turn_off', { entity_id: 'media_player.living_room_lg_tv' });
    callService('media_player', 'turn_off', { entity_id: 'media_player.lg_speaker_s95tr' });
    // Turn off lights & plugs
    callService('light', 'turn_off', { entity_id: 'light.dining_table_light' });
    callService('switch', 'turn_off', { entity_id: 'switch.dining_coffee_bar' });
    callService('fan', 'turn_off', { entity_id: 'fan.hall_ceiling_fan' });
    callService('fan', 'turn_off', { entity_id: 'fan.bedroom_fan' });
    // Lock front door
    callService('lock', 'lock', { entity_id: 'lock.front_door' });
    setIsAllOffOpen(false);
  };

  return (
    <div 
      className="h-screen w-full bg-black text-slate-100 font-sans overflow-hidden relative flex flex-col select-none"
      onClick={handleContainerClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* SVG Filter for Organic Water Distortion */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }}>
        <filter id="water-ripple-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* LAYER 0: 3D Atmospheric Sky & Rain on Glass (low power when dimmed screensaver) */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-all duration-1000 ${
        isScreensaver && isDimmed ? 'opacity-40 filter brightness-60' : 'opacity-100'
      }`}>
        <Weather3D 
          condition={displayWeather as WeatherCondition} 
          moonFraction={moonPhase.fraction} 
          lowPower={isScreensaver && isDimmed}
        />
      </div>

      {/* Water Ripples Layer (Always responsive to user touch/click) */}
      <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {ripples.map((r) => {
            const isMain = r.type === 'main';
            const size = isMain ? 380 : 180;
            const duration = isMain ? 2.4 : 1.8;
            const isNight = displayWeather === 'night';

            return (
              <div 
                key={r.id}
                className="absolute pointer-events-none flex items-center justify-center"
                style={{
                  left: r.x - size / 2,
                  top: r.y - size / 2,
                  width: size,
                  height: size,
                }}
              >
                {/* Primary Ripple Wave */}
                <motion.div
                  initial={{ 
                    scale: 0.05, 
                    opacity: 0.9, 
                    borderWidth: '6px',
                    borderRadius: '42% 58% 45% 55% / 55% 45% 58% 42%'
                  }}
                  animate={{ 
                    scale: 1, 
                    opacity: 0, 
                    borderWidth: '0px',
                    borderRadius: [
                      '42% 58% 45% 55% / 55% 45% 58% 42%', 
                      '58% 42% 55% 45% / 45% 55% 42% 58%', 
                      '48% 52% 46% 54% / 54% 46% 52% 48%'
                    ]
                  }}
                  transition={{ duration: duration, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                  style={{
                    borderColor: isNight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.55)',
                    boxShadow: isNight 
                      ? '0 0 30px rgba(0,0,0,0.6), inset 0 0 25px rgba(0,0,0,0.6), 0 0 15px rgba(255,255,255,0.7)'
                      : '0 0 25px rgba(0,0,0,0.4), inset 0 0 25px rgba(0,0,0,0.4), 0 0 12px rgba(255,255,255,0.45)',
                    backdropFilter: isNight ? 'blur(3px) brightness(1.4)' : 'blur(3px) brightness(1.1)',
                    WebkitBackdropFilter: isNight ? 'blur(3px) brightness(1.4)' : 'blur(3px) brightness(1.1)',
                    filter: 'url(#water-ripple-filter)',
                  }}
                />
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Atmospheric Weather Toy (Discreet Lower-Right Showcase Trigger - Always available) */}
      <WeatherToy 
        vibe={vibe} 
        setVibe={setVibe} 
        displayWeather={displayWeather} 
      />

      {/* STATE A: SCREENSAVER MODE (Default idle state) */}
      <AnimatePresence>
        {isScreensaver && (
          <motion.div
            key="screensaver-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 z-20"
          >
            <AtmosphericScreensaver 
              currentTime={currentTime}
              displayWeather={displayWeather}
              isDimmed={isDimmed}
              onWake={() => wakeDashboard()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATE B: ACTIVE DASHBOARD CONTROLS (Revealed on Double Tap) */}
      <AnimatePresence>
        {!isScreensaver && (
          <motion.div
            key="dashboard-controls"
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 flex flex-col h-full w-full pointer-events-auto"
          >
            {/* LAYER 2: Persistent Global Ambient Header */}
            <GlobalHeader 
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenAllOffConfirm={() => setIsAllOffOpen(true)}
              displayWeather={displayWeather}
              onSleep={sleepDashboard}
            />

            {/* LAYER 3: The 5-Zone Architectural Coverflow Stage with Horizontal Swipe */}
            <ZoneCoverflow 
              onOpenModal={(id) => setSelectedModalEntityId(id)} 
              onOpenMatrixHUD={() => setIsZoneMatrixOpen(true)}
            />

            {/* Gesture-driven minimal Zone Indicator & Simulation Trigger (Replaces heavy tabs) */}
            <ZoneGestureNav 
              onOpenMatrixHUD={() => setIsZoneMatrixOpen(true)}
              onNextZone={handleNextZone}
              onPrevZone={handlePrevZone}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Holographic Zone Matrix Quick-Jump HUD (Triggered by 0.5s Long Press or HUD pill) */}
      <ZoneMatrixHUD 
        isOpen={isZoneMatrixOpen} 
        onClose={() => setIsZoneMatrixOpen(false)} 
      />

      {/* LAYER 4: Deep Kinetic Modals (AC Dial, S95TR Audio Suite, Sheer Curtain) */}
      <KineticModals 
        entityId={selectedModalEntityId} 
        onClose={() => setSelectedModalEntityId(null)} 
      />

      {/* Settings Modal (HA Connection & Token) */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Goodnight / Master All-Off Confirmation Dialog */}
      <AnimatePresence>
        {isAllOffOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAllOffOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm rounded-3xl bg-slate-950/90 border border-white/20 p-6 shadow-2xl backdrop-blur-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 mx-auto flex items-center justify-center mb-3">
                <Power size={22} />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Goodnight Routine</h3>
              <p className="text-xs text-white/60 mb-6">
                Turn off living room AC, TV, soundbar, lights, and ensure front door is locked?
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsAllOffOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white/80 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={executeMasterAllOff}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-medium text-white shadow-lg transition-all"
                >
                  Execute All Off
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  return (
    <HomeAssistantProvider>
      <DashboardContent />
    </HomeAssistantProvider>
  );
};
