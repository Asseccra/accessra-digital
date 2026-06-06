import React from 'react';
import { Search, LogOut, Award, Coins } from 'lucide-react';
import { UserProfile } from '../types';
import Logo from './Logo';

interface HeaderProps {
  user: UserProfile;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({
  user,
  onLogout,
  searchQuery,
  setSearchQuery
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 transition-all duration-300 border-none font-display bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white shadow-[0_4px_20px_rgba(2,86,255,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <Logo size={42} glow={true} showText={false} />
          <div>
            <h1 className="text-xl font-black tracking-tight mb-0.5 leading-none">
              Accessra <span className="text-sky-100">Digital</span>
            </h1>
            <p className="text-[9px] tracking-[0.2em] font-mono uppercase text-cyan-100">
              Premium Fintech Gateway
            </p>
          </div>
        </div>

        {/* Real-time Search Panel */}
        <div className="flex-1 max-w-sm relative">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-blue-100" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari voucher game, streaming, software, e-wallet..."
              className="w-full py-2 pl-10 pr-4 rounded-xl text-xs border focus:outline-none transition-all duration-300 bg-white/15 border-white/10 focus:bg-white/20 focus:border-white text-white placeholder:text-blue-100/70"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2.5 text-xs font-bold leading-none text-white hover:text-white/80"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* User Stats & Action Bar */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* User Tier Level Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold border-white/20 bg-white/10 text-white shadow-sm">
            <Award className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>Tier: {user.level}</span>
          </div>

          {/* Loyalty Cashback Point Tracker */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold border-amber-400/30 bg-amber-400/20 text-white font-extrabold shadow-sm">
            <Coins className="w-3.5 h-3.5 text-yellow-300" />
            <span>Rp {user.cashbackPoints.toLocaleString('id-ID')} Poin</span>
          </div>

          {/* Controls: Mode Trigger & Dev Portal & LogOut */}
          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              title="Keluar Akun"
              className="p-2 rounded-xl border cursor-pointer transition-all duration-300 border-white/10 bg-white/10 hover:bg-rose-600 text-white"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
