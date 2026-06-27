import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

export default function CosmicBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate static starry embers to prevent hydration mismatch
    const generatedStars = Array.from({ length: 45 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.5 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 3,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#0e0c0a]">
      {/* Mystical vintage paper texture grain overlays */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #b48257 0px, #b48257 1px, transparent 0px, transparent 50%), repeating-linear-gradient(-45deg, #b48257 0px, #b48257 1px, transparent 0px, transparent 50%)',
        backgroundSize: '4px 4px'
      }} />

      {/* Atmospheric Amber & Sepia Nebulous Glows (replaces purple) */}
      <div className="absolute top-[-10%] left-[-15%] w-[70%] h-[70%] rounded-full bg-[#1e130c]/30 blur-[130px] mix-blend-screen" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[65%] h-[65%] rounded-full bg-[#2a1b12]/20 blur-[130px] mix-blend-screen" />
      <div className="absolute top-[35%] right-[15%] w-[50%] h-[50%] rounded-full bg-stone-900/40 blur-[110px] mix-blend-screen" />

      {/* Astro-Compass Fine Dot Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(circle, #b48257 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* concentric geocentric orbits for cosmic alignment */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border border-[#b48257]/5 rounded-full pointer-events-none animate-orbit" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-dashed border-[#b48257]/5 rounded-full pointer-events-none animate-reverse-orbit" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-double border-[#b48257]/4 rounded-full pointer-events-none" />

      {/* Glowing Star Embers */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-[#ffdca8]/50"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `star-flicker ${star.duration}s infinite ease-in-out`,
            animationDelay: `${star.delay}s`,
            boxShadow: star.size > 2 ? '0 0 5px rgba(253, 186, 116, 0.5)' : 'none'
          }}
        />
      ))}
    </div>
  );
}
