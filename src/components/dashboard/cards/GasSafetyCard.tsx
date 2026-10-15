import React from 'react';
import { ShieldCheck, ShieldAlert, Flame, AlertCircle } from 'lucide-react';
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext';

export const GasSafetyCard: React.FC = () => {
  const { entities, setEntityAttribute } = useHomeAssistant();
  const gasSensor = entities['binary_sensor.kitchen_gas_detector'];

  if (!gasSensor) return null;

  const isAlarm = gasSensor.state === 'on';
  const ppm = gasSensor.attributes.gas_density_ppm ?? 0;

  const toggleTestSimulation = () => {
    setEntityAttribute('binary_sensor.kitchen_gas_detector', {
      gas_density_ppm: isAlarm ? 0 : 420
    });
    // Toggle state
    gasSensor.state = isAlarm ? 'off' : 'on';
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 ${
      isAlarm
        ? 'glass-card-active border-rose-500/50 text-white animate-pulse shadow-[0_0_30px_rgba(244,63,94,0.3)]'
        : 'glass-card border-white/10 text-white/70 hover:border-white/20 hover:text-white'
    }`}>
      {/* Specular Top Light Ridge */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
            isAlarm 
              ? 'bg-rose-500/30 border-rose-400/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.35)]' 
              : 'bg-emerald-500/20 border-emerald-400/35 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
          }`}>
            {isAlarm ? <ShieldAlert size={19} /> : <ShieldCheck size={19} />}
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">Gas & Methane Safety</h4>
            <p className="text-[11px] text-white/60 font-light">
              {isAlarm ? 'CRITICAL: Gas Detected' : 'Apartment Safety Monitor • All Clear'}
            </p>
          </div>
        </div>

        <button
          onClick={toggleTestSimulation}
          className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all"
        >
          {isAlarm ? 'Clear Alarm' : 'Self-Test'}
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center space-x-2">
          <Flame size={16} className={isAlarm ? 'text-rose-400 animate-bounce' : 'text-emerald-400'} />
          <span className="text-xs text-white/80">Gas Concentration</span>
        </div>
        <div className="text-right">
          <span className={`text-base font-mono font-medium ${isAlarm ? 'text-rose-400' : 'text-emerald-400'}`}>
            {ppm} PPM
          </span>
          <p className="text-[10px] text-white/40">Threshold: 200 PPM</p>
        </div>
      </div>
    </div>
  );
};
