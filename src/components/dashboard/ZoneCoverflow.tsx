import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { useHomeAssistant, ZONES } from '../../contexts/HomeAssistantContext';
import { HaierACCard } from './cards/HaierACCard';
import { AudiophileMediaCard } from './cards/AudiophileMediaCard';
import { SheerCurtainCard } from './cards/SheerCurtainCard';
import { CeilingFanCard } from './cards/CeilingFanCard';
import { DiningLightCard } from './cards/DiningLightCard';
import { CoffeeBarCard } from './cards/CoffeeBarCard';
import { RangeHoodCard } from './cards/RangeHoodCard';
import { GasSafetyCard } from './cards/GasSafetyCard';
import { BedroomACCard } from './cards/BedroomACCard';
import { ClothesDryerCard } from './cards/ClothesDryerCard';
import { WaterHeaterCard } from './cards/WaterHeaterCard';

interface ZoneCoverflowProps {
  onOpenModal: (entityId: string) => void;
  onOpenMatrixHUD?: () => void;
}

export const ZoneCoverflow: React.FC<ZoneCoverflowProps> = ({ onOpenModal, onOpenMatrixHUD }) => {
  const { activeZoneId, setActiveZoneId } = useHomeAssistant();
  const currentZone = ZONES.find((z) => z.id === activeZoneId) || ZONES[0];
  const currentIndex = ZONES.findIndex((z) => z.id === activeZoneId);

  // Direction state for left-right swipe transition
  const [slideDirection, setSlideDirection] = useState<number>(1);

  const goToNextZone = () => {
    setSlideDirection(1);
    const nextIdx = (currentIndex + 1) % ZONES.length;
    setActiveZoneId(ZONES[nextIdx].id);
  };

  const goToPrevZone = () => {
    setSlideDirection(-1);
    const prevIdx = (currentIndex - 1 + ZONES.length) % ZONES.length;
    setActiveZoneId(ZONES[prevIdx].id);
  };

  // Handle drag / swipe release
  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50; // swipe displacement threshold
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset < -threshold || velocity < -300) {
      goToNextZone();
    } else if (offset > threshold || velocity > 300) {
      goToPrevZone();
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-center px-4 sm:px-8 max-w-6xl mx-auto z-10 pointer-events-auto overflow-y-auto hide-scrollbar py-2 select-none">
      {/* Zone Title & Architectural Subtitle (Clickable to open Matrix HUD) */}
      <div 
        onClick={onOpenMatrixHUD}
        className="mb-4 text-center cursor-pointer group"
        title="Click to open Zone Matrix"
      >
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-pill border border-white/10 mb-2 transition-all group-hover:border-cyan-400/40 group-hover:bg-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-cyan-200/90">
            Zone 0{currentIndex + 1} of 0{ZONES.length}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-light font-display tracking-tight text-white drop-shadow-lg group-hover:text-cyan-100 transition-colors">
          {currentZone.name}
        </h2>
        <p className="text-xs sm:text-sm text-white/60 tracking-wider font-light mt-0.5">
          {currentZone.subtitle}
        </p>
      </div>

      {/* Kinetic Swipe Stage Deck */}
      <div className="relative w-full overflow-hidden">
        <AnimatePresence mode="wait" custom={slideDirection}>
          <motion.div
            key={activeZoneId}
            custom={slideDirection}
            initial={(dir: number) => ({
              opacity: 0,
              x: dir > 0 ? 80 : -80,
              scale: 0.97,
              filter: 'blur(4px)'
            })}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              filter: 'blur(0px)'
            }}
            exit={(dir: number) => ({
              opacity: 0,
              x: dir > 0 ? -80 : 80,
              scale: 0.97,
              filter: 'blur(4px)'
            })}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pb-2 cursor-grab active:cursor-grabbing"
          >
            {/* 1. Living Room */}
            {activeZoneId === 'living_room' && (
              <>
                <HaierACCard onExpand={() => onOpenModal('climate.living_room_hall_ac')} />
                <AudiophileMediaCard onExpand={() => onOpenModal('media_player.lg_speaker_s95tr')} />
                <SheerCurtainCard onExpand={() => onOpenModal('cover.living_room_vertical_curtain')} />
                <CeilingFanCard entityId="fan.hall_ceiling_fan" title="Hall Ceiling Fan" />
              </>
            )}

            {/* 2. Dining Area */}
            {activeZoneId === 'dining' && (
              <>
                <DiningLightCard />
                <CoffeeBarCard />
              </>
            )}

            {/* 3. Kitchen & Safety */}
            {activeZoneId === 'kitchen' && (
              <>
                <RangeHoodCard />
                <GasSafetyCard />
              </>
            )}

            {/* 4. Master Bedroom */}
            {activeZoneId === 'bedroom' && (
              <>
                <BedroomACCard onExpand={() => onOpenModal('climate.bedroom_ac')} />
                <CeilingFanCard 
                  entityId="fan.bedroom_fan" 
                  title="Bedroom Ceiling Fan" 
                  subtitle="Whisper Quiet DC Motor" 
                />
              </>
            )}

            {/* 5. Balcony & Utility */}
            {activeZoneId === 'balcony' && (
              <>
                <ClothesDryerCard />
                <WaterHeaterCard />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
