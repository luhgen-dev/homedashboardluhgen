import React from 'react';
import { Coffee, Power, Zap } from 'lucide-react';
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext';

export const CoffeeBarCard: React.FC = () => {
  const { entities, toggleEntity } = useHomeAssistant();
  const plug = entities['switch.dining_coffee_bar'];

  if (!plug) return null;

  const isOn = plug.state === 'on';
  const powerW = plug.attributes.current_power_w ?? 145;
  const energyKwh = plug.attributes.today_energy_kwh ?? 0.62;

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 ${
      isOn 
        ? 'glass-card-active text-white' 
        : 'glass-card border-white/10 text-white/70 hover:border-white/20 hover:text-white'
    }`}>
      {/* Specular Top Light Ridge */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
            isOn ? 'bg-orange-500/25 border-orange-400/40 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-white/5 border-white/10 text-white/50'
          }`}>
            <Coffee size={19} />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">Coffee Bar & Espresso</h4>
            <p className="text-[11px] text-white/60 font-light">
              {isOn ? 'Smart Plug • Ready for brewing' : 'Plug Standby'}
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleEntity('switch.dining_coffee_bar')}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
            isOn 
              ? 'bg-orange-500/30 border-orange-400/50 text-orange-200 hover:bg-orange-500/40' 
              : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/15 hover:text-white'
          }`}
        >
          <Power size={14} />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center space-x-1 text-[11px] text-white/60 mb-1">
            <Zap size={11} className="text-amber-400" />
            <span>Active Draw</span>
          </div>
          <p className="text-xl font-light text-white tabular-nums">
            {isOn ? `${powerW} W` : '0 W'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="text-[11px] text-white/60 mb-1">Today's Energy</div>
          <p className="text-xl font-light text-white tabular-nums">
            {energyKwh} <span className="text-xs text-white/50">kWh</span>
          </p>
        </div>
      </div>
    </div>
  );
};
