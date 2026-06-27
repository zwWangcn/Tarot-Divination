import React from 'react';

export default function CardBackSvg() {
  return (
    <div className="w-full h-full relative bg-[#130f0d] rounded-xl border border-[#b48257]/40 overflow-hidden p-2.5 flex flex-col justify-between items-center select-none shadow-[inset_0_0_20px_rgba(180,130,87,0.15)]">
      {/* Ancient Copperplate Borders */}
      {/* Outer fine double border */}
      <div className="absolute inset-1.5 border border-[#b48257]/20 rounded-lg pointer-events-none" />
      <div className="absolute inset-2 border border-[#b48257]/10 rounded-lg pointer-events-none" />
      
      {/* Inner fine ruled rectangle */}
      <div className="absolute inset-3.5 border border-dashed border-[#b48257]/15 rounded-md pointer-events-none" />

      {/* Ornate corners reminiscent of 16th-century prints */}
      <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-[#b48257]/45 pointer-events-none" />
      <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-[#b48257]/45 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-[#b48257]/45 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-[#b48257]/45 pointer-events-none" />

      {/* Hand-drawn cross-hatch corner textures */}
      <div className="absolute top-2.5 left-2.5 text-[#b48257]/10 text-[6px] select-none pointer-events-none">///</div>
      <div className="absolute top-2.5 right-2.5 text-[#b48257]/10 text-[6px] select-none pointer-events-none">\\\</div>
      <div className="absolute bottom-2.5 left-2.5 text-[#b48257]/10 text-[6px] select-none pointer-events-none">\\\\</div>
      <div className="absolute bottom-2.5 right-2.5 text-[#b48257]/10 text-[6px] select-none pointer-events-none">////</div>

      {/* Top Header Text with vintage typography vibe */}
      <div className="flex flex-col items-center z-10 pt-3">
        <span className="text-[7px] font-serif text-[#b48257]/70 tracking-[0.25em] uppercase font-bold">TABULA REVELATA</span>
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#b48257]/30 to-transparent mt-0.5" />
      </div>

      {/* Center Sacred Astronomy Astrolabe (Sun, Moon Orbits, Constellations) */}
      <div className="relative w-32 h-32 flex items-center justify-center z-10 my-auto">
        {/* Geocentric Orbits */}
        <div className="absolute inset-0 border border-[#b48257]/15 rounded-full animate-orbit" />
        <div className="absolute inset-2 border border-dashed border-[#b48257]/20 rounded-full" />
        <div className="absolute inset-4 border border-[#b48257]/10 rounded-full" />
        
        {/* Fine Star Constellations Lines (Diagonal compass axes) */}
        <div className="absolute inset-0 flex justify-center items-center opacity-25 pointer-events-none">
          <div className="w-full h-[0.5px] bg-[#b48257]/20 rotate-12" />
          <div className="w-full h-[0.5px] bg-[#b48257]/20 rotate-[102deg]" />
          <div className="w-full h-[0.5px] bg-[#b48257]/25 border-t border-[#b48257]/10 border-dashed" />
        </div>

        {/* Opposite Crescent Moon engravings */}
        <svg 
          className="absolute w-24 h-24 text-[#b48257]/25 opacity-80" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.75"
        >
          {/* Geocentric crescents */}
          <path d="M12 2.5a9.5 9.5 0 00-7 15.5 9.5 9.5 0 117-15.5z" />
          <path d="M12 21.5a9.5 9.5 0 007-15.5 9.5 9.5 0 11-7 15.5z" />
        </svg>

        {/* Central Solar Eye */}
        <div className="relative w-12 h-12 bg-[#191411] border border-[#b48257]/50 rounded-full flex items-center justify-center shadow-lg">
          {/* Inner concentric ring */}
          <div className="absolute inset-1 border border-[#b48257]/20 rounded-full" />
          
          <svg 
            className="w-7 h-7 text-[#b48257]/80 animate-spin-slow" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Sun rays with engraving nodes */}
            <circle cx="12" cy="12" r="2.5" fill="rgba(180, 130, 87, 0.15)" />
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </div>

        {/* Astrolabe degree markings or mystical labels */}
        <div className="absolute top-1 left-2 text-[#b48257]/45 text-[7px] font-serif">A</div>
        <div className="absolute bottom-1 right-2 text-[#b48257]/45 text-[7px] font-serif">Ω</div>
        <div className="absolute top-1 right-2 text-[#b48257]/45 text-[7px] font-serif">☾</div>
        <div className="absolute bottom-1 left-2 text-[#b48257]/45 text-[7px] font-serif">☼</div>
      </div>

      {/* Bottom Footer Text */}
      <div className="flex flex-col items-center z-10 pb-3">
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#b48257]/30 to-transparent mb-0.5" />
        <span className="text-[7px] font-serif text-[#b48257]/50 tracking-[0.35em] uppercase">STARDUST TAROT</span>
      </div>
    </div>
  );
}
