import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Server, Key, Radio, Check, AlertCircle, Info } from 'lucide-react';
import { useHomeAssistant } from '../../contexts/HomeAssistantContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    haUrl, 
    haToken, 
    isDemoMode, 
    isConnected, 
    isConnecting, 
    connectionError, 
    saveConfig 
  } = useHomeAssistant();

  const [urlInput, setUrlInput] = useState(haUrl);
  const [tokenInput, setTokenInput] = useState(haToken);
  const [demoInput, setDemoInput] = useState(isDemoMode);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig(urlInput.trim(), tokenInput.trim(), demoInput);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md rounded-3xl bg-slate-950/85 border border-white/20 p-6 shadow-2xl backdrop-blur-2xl text-white"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
          >
            <X size={16} />
          </button>

          <div className="flex items-center space-x-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Server size={16} />
            </div>
            <h3 className="text-lg font-medium text-white">Home Assistant Bridge</h3>
          </div>
          <p className="text-xs text-white/60 mb-5">
            Connect to your live local Home Assistant WebSocket or run in Interactive Simulation.
          </p>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Mode Switcher */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white">Interactive Simulation</p>
                <p className="text-[11px] text-white/50">Run with responsive local mock state</p>
              </div>
              <button
                type="button"
                onClick={() => setDemoInput(!demoInput)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border ${
                  demoInput ? 'bg-cyan-500 border-cyan-400' : 'bg-white/10 border-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    demoInput ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* URL Input */}
            <div>
              <label className="text-xs text-white/70 font-medium block mb-1">
                Home Assistant Instance URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="http://homeassistant.local:8123 or https://xxxx.ui.nabu.casa"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={demoInput}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-cyan-400 disabled:opacity-40"
                />
              </div>
            </div>

            {/* Token Input */}
            <div>
              <label className="text-xs text-white/70 font-medium block mb-1">
                Long-Lived Access Token (LLAT)
              </label>
              <input
                type="password"
                placeholder="Paste Bearer token from HA Profile"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                disabled={demoInput}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-cyan-400 disabled:opacity-40 font-mono"
              />
            </div>

            {/* Connection Status indicator */}
            {!demoInput && (
              <div className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                isConnected 
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
                  : isConnecting
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  : 'bg-white/5 border-white/10 text-white/60'
              }`}>
                <Radio size={14} className={isConnecting ? 'animate-spin' : ''} />
                <span>
                  {isConnected 
                    ? 'Connected live to Home Assistant!' 
                    : isConnecting 
                    ? 'Connecting to WebSocket...' 
                    : connectionError || 'Offline / Ready to connect'}
                </span>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-xs shadow-lg transition-all flex items-center justify-center space-x-1.5"
              >
                {saveSuccess ? (
                  <>
                    <Check size={14} />
                    <span>Saved Configuration!</span>
                  </>
                ) : (
                  <span>Apply & Save</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
