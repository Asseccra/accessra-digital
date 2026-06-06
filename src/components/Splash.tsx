import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, TrendingUp, Users } from 'lucide-react';
import Logo from './Logo';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white text-slate-900 flex flex-col items-center justify-between p-8 z-50 overflow-hidden font-display">
      {/* Gentle ocean blue breathing background auras */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-sky-200/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-blue-400/10 rounded-full blur-[100px]" />

      <div />

      {/* Main Logo Showcase */}
      <div className="flex flex-col items-center select-none relative">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6 flex justify-center"
        >
          {/* Brand Logo inside a soft ocean background bubble matching Store App Icon */}
          <div className="p-8 rounded-[40px] bg-white shadow-[0_20px_50px_rgba(0,102,255,0.15)] border border-slate-50 relative group">
            {/* Soft pulsing border halo */}
            <div className="absolute -inset-1 rounded-[42px] bg-gradient-to-tr from-blue-500 to-cyan-400 opacity-20 blur-lg animate-pulse" />
            <Logo size={130} glow={true} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          <motion.h1 
            className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500"
          >
            Accessra
          </motion.h1>
          <p className="text-sky-500 text-xs uppercase tracking-[0.45em] font-mono font-extrabold mt-1.5 select-none">
            D I G I T A L
          </p>
        </motion.div>
      </div>

      {/* Brand value pillars */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="w-full max-w-lg mb-4"
      >
        <div className="grid grid-cols-4 gap-2 text-center text-[10px] uppercase font-mono tracking-wider text-slate-500">
          <div className="flex flex-col items-center gap-1.5">
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-800">Trusted</span>
            <span className="text-[8px] text-slate-400 lowercase">Reliable</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-500 animate-bounce">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-800">Fast</span>
            <span className="text-[8px] text-slate-400 lowercase">Instant</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-800">Grow</span>
            <span className="text-[8px] text-slate-400 lowercase">Limitless</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 text-sky-500">
              <Users className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-800">Accessible</span>
            <span className="text-[8px] text-slate-400 lowercase">Everyone</span>
          </div>
        </div>

        {/* Loading progress glow bar */}
        <div className="w-full h-[4px] bg-slate-100 rounded-full mt-8 overflow-hidden relative">
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-blue-600 to-transparent filter drop-shadow-[0_0_6px_rgba(0,102,255,0.8)]"
          />
        </div>
      </motion.div>
    </div>
  );
}
