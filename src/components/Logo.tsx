import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  className?: string;
  glow?: boolean;
}

export default function Logo({
  size = 50,
  showText = false,
  textColor = 'text-slate-900',
  className = '',
  glow = true
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div 
        className="relative flex items-center justify-center shrink-0" 
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 500 500"
          className={`w-full h-full transition-transform duration-350 ${
            glow ? 'drop-shadow-[0_4px_12px_rgba(2,86,255,0.4)]' : ''
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoPrimaryBack" x1="10%" y1="90%" x2="90%" y2="10%">
              <stop offset="0%" stopColor="#004BFF" />
              <stop offset="60%" stopColor="#007CFF" />
              <stop offset="100%" stopColor="#02AFFF" />
            </linearGradient>
            <linearGradient id="logoSecondaryFold" x1="30%" y1="80%" x2="90%" y2="20%">
              <stop offset="0%" stopColor="#0288FF" />
              <stop offset="50%" stopColor="#00D2FF" />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>
            <filter id="gentleGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0055FF" floodOpacity="0.25"/>
            </filter>
          </defs>
          
          {/* Main sweeping aerodynamic left stem of the Accessra "A" */}
          <path
            d="M 85 390 C 85 390, 115 370, 140 330 L 290 110 C 310 80, 345 70, 375 90 C 405 110, 410 145, 390 175 L 235 390 Z"
            fill="url(#logoPrimaryBack)"
            filter="url(#gentleGlow)"
          />
          
          {/* Overlapping precision triangular tech fold (origami element) */}
          <path
            d="M 230 390 L 320 260 L 415 390 Z"
            fill="url(#logoSecondaryFold)"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`text-xl font-extrabold tracking-wide font-display ${textColor}`}>
            Accessra
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-sky-500 font-mono font-bold mt-0.5">
            D I G I T A L
          </span>
        </div>
      )}
    </div>
  );
}
