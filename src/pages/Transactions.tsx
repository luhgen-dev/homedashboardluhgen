import React from 'react';
import { motion } from 'motion/react';

export const Transactions: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">Ledger & Inbox</h2>
          <p className="text-stone-500 mt-1">Zone 2 Shared Transactions</p>
        </div>
        <button className="bg-stone-900 text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-stone-800 transition-colors">
          + Log Expense
        </button>
      </header>

      {/* Digital Handshake Inbox */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          Digital Handshake Required
        </h3>
        <div className="space-y-3">
          {/* Placeholder for pending transactions */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-900">Groceries - Jaya Grocer</p>
              <p className="text-sm text-stone-500">Logged by Partner • 2 hours ago</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-stone-900">RM 145.50</span>
              <button className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-100">
          <h3 className="text-lg font-semibold text-stone-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-stone-100">
          {/* Placeholder items */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                  🛒
                </div>
                <div>
                  <p className="font-medium text-stone-900">Household Supplies</p>
                  <p className="text-sm text-stone-500">Acknowledged • Yesterday</p>
                </div>
              </div>
              <span className="font-medium text-stone-900">- RM 45.00</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
