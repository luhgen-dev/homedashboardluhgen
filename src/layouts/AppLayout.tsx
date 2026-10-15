import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Receipt, TrendingUp, ShoppingCart, Settings, CircleDollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const AppLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <div className="bg-[#101f22] min-h-screen text-white font-sans selection:bg-white/20 overflow-hidden">
      {/* Main Content Area - Full Screen for Orbital Command */}
      <main className="w-full h-screen relative z-10 overflow-hidden">
        <Outlet context={{ isMobile: false }} />
      </main>
    </div>
  );
};
