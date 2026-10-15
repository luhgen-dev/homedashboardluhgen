import React from 'react';
import { motion } from 'motion/react';

export const Bridge: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">Strategic Bridge</h2>
          <p className="text-stone-500 mt-1">Overtime Forecasting & Cash Flow</p>
        </div>
        <button className="bg-stone-900 text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-stone-800 transition-colors">
          + Log OT Shift
        </button>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Current Gap (24th - 7th)</h3>
        <div className="flex items-end gap-4 mb-6">
          <p className="text-5xl font-light tracking-tight text-rose-600">RM 420.00</p>
          <p className="text-stone-500 pb-1">Required Bridge</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 rounded-full h-4 mb-2 overflow-hidden">
          <div className="bg-emerald-500 h-4 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <p className="text-sm text-stone-500 font-medium">RM 189.00 Secured (45%)</p>

        <div className="mt-8">
          <h4 className="font-medium text-stone-900 mb-3">Options to close gap:</h4>
          <ul className="space-y-2 text-stone-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-300"></span>
              3 Weekday OT shifts (0.90 reliability)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-300"></span>
              2 Weekday + 1 Saturday OT
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-300"></span>
              1 Sunday + 1 Weekday OT
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
