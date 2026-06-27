import React, { useEffect, useState } from 'react';

const MYSTICAL_QUOTES = {
  zh: [
    "“星辰在静谧中运转，低语着命运的谶言。”",
    "“闭上双眼，让当下的问题与宇宙的律动合一。”",
    "“万物皆有因果，塔罗牌只是映射你潜意识的一面明镜。”",
    "“过去的波纹塑造当下，而未来的晨曦正在指尖凝结。”",
    "“不要畏惧倒吊与高塔，每一次崩塌都是重获新生的序曲。”",
    "“在安静中倾听，命运的洪流总会为你让出一条通道。”"
  ],
  en: [
    "“The stars rotate in silence, whispering the prophecies of fate.”",
    "“Close your eyes and align your question with the rhythm of the cosmos.”",
    "“Everything has a cause; the Tarot is but a mirror reflecting your subconscious.”",
    "“Ripples of the past shape the present, and the dawn of the future condenses at your fingertips.”",
    "“Fear not the Hanged Man or the Tower; every collapse is a prelude to rebirth.”",
    "“Listen in stillness; the torrent of destiny will always make way for you.”"
  ],
  ja: [
    "「星々は静寂の中で回転し、運命の託宣を囁いている。」",
    "「目を閉じ、今の問いかけを宇宙の鼓動と同調させなさい。」",
    "「万物には因果があり、タロットは潜在意識を映し出す鏡に過ぎない。」",
    "「過去の波紋が現在を形作り、未来の夜明けが指先に凝縮されていく。」",
    "「吊された男や塔を恐れるな。すべての崩壊は新生への序曲に過ぎない。」",
    "「静寂の中で傾聴せよ。運命の急流は常にあなたのために道を譲る。」"
  ]
};

const RITUAL_STEPS = {
  zh: [
    "正在开启塔罗神谕仪轨...",
    "正在连结深层潜意识星盘...",
    "正在召唤四大炼金元素...",
    "正在唤醒大阿尔卡那启示...",
    "正在编制星轨命运书卷，请保持内心宁静..."
  ],
  en: [
    "Opening the sacred Tarot oracle...",
    "Connecting to the deep subconscious astrolabe...",
    "Summoning the four alchemical elements...",
    "Awakening the major arcana revelation...",
    "Weaving the fate scrolls of the starry orbits, remain still..."
  ],
  ja: [
    "タロットの神託儀式を開始しています...",
    "潜在意識のアストロラーベと同調中...",
    "四大錬金元素の力を召喚しています...",
    "大アルカナの啓示を呼び起こしています...",
    "星界の軌道から運命の書巻を紡ぎ出しています。静かにお待ちください..."
  ]
};

interface DivinationLoadingProps {
  lang?: 'zh' | 'en' | 'ja';
}

export default function DivinationLoading({ lang = 'zh' }: DivinationLoadingProps) {
  const activeLang = lang === 'en' || lang === 'ja' || lang === 'zh' ? lang : 'zh';
  const quotes = MYSTICAL_QUOTES[activeLang];
  const steps = RITUAL_STEPS[activeLang];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Cycle quotes every 4.5s
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4500);

    // Cycle steps every 1.5s
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1500);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(stepInterval);
    };
  }, [quotes.length, steps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 max-w-lg mx-auto text-center z-10">
      {/* Ancient Astronomical Astrolabe Loader */}
      <div className="relative w-44 h-44 flex items-center justify-center mb-10">
        {/* Ancient Etched Concentric Borders */}
        <div className="absolute inset-0 border border-amber-600/30 rounded-full animate-pulse-slow" />
        <div className="absolute inset-3 border border-double border-amber-700/25 rounded-full" />
        
        {/* Woodcut engraving lines */}
        <div className="absolute inset-6 border border-dashed border-amber-600/20 rounded-full animate-orbit" />
        <div className="absolute inset-10 border border-amber-800/15 rounded-full animate-reverse-orbit" />

        {/* Outer compass degree marks simulated via divs */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-40">
          <div className="w-full h-px border-t border-amber-600/10 rotate-0 absolute" />
          <div className="w-full h-px border-t border-amber-600/10 rotate-45 absolute" />
          <div className="w-full h-px border-t border-amber-600/10 rotate-90 absolute" />
          <div className="w-full h-px border-t border-amber-600/10 rotate-135 absolute" />
        </div>

        {/* Shimmering Engraved Alchemical Orb */}
        <div className="relative w-24 h-24 bg-gradient-to-tr from-stone-950 via-[#1a1410] to-[#261c16] border-2 border-amber-500/40 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(194,122,71,0.15)] overflow-hidden">
          {/* Concentric rings inside orb */}
          <div className="absolute inset-2 border border-amber-700/10 rounded-full animate-spin-slow" />
          
          {/* Rotating Alchemical Sun Engraving */}
          <svg 
            className="w-14 h-14 text-amber-500/40 animate-spin-slow absolute opacity-75"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Center disk */}
            <circle cx="12" cy="12" r="3" />
            {/* Fine woodcut style wavy rays */}
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            <path d="M12 5.5l1 1.5-1 1.5M12 15.5l1 1.5-1 1.5M5.5 12l1.5 1-1.5 1M15.5 12l1.5 1-1.5 1" />
          </svg>

          {/* Central Alchemical Star */}
          <div className="relative w-4 h-4 bg-amber-500/10 border border-amber-400 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.5)]">
            <div className="w-1.5 h-1.5 bg-amber-200 rounded-full" />
          </div>
        </div>

        {/* Etching style marks around astrolabe */}
        <div className="absolute top-2 left-6 text-amber-500/30 text-[10px] font-mono select-none">Ⅰ</div>
        <div className="absolute bottom-4 right-8 text-amber-500/30 text-[8px] font-mono select-none">ⅩⅡ</div>
        <div className="absolute top-1/2 -right-3 text-amber-500/30 text-[9px] font-mono select-none">Ⅵ</div>
        <div className="absolute top-12 right-2 text-amber-500/20 text-[10px] animate-pulse">☼</div>
        <div className="absolute bottom-10 left-0 text-amber-500/20 text-[8px] animate-pulse">☾</div>
      </div>

      {/* Loading Status Step */}
      <h3 className="font-serif text-base md:text-lg text-amber-400 font-medium mb-4 tracking-wider animate-pulse">
        {steps[stepIndex]}
      </h3>

      {/* Fade-in Mystical Whisper */}
      <div className="min-h-[60px] flex items-center justify-center">
        <p className="text-stone-400 italic text-xs md:text-sm leading-relaxed max-w-sm tracking-wide font-serif animate-pulse-slow">
          {quotes[quoteIndex]}
        </p>
      </div>

      {/* Decorative footer elements */}
      <div className="flex justify-center items-center space-x-3 mt-8 opacity-40">
        <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-600" />
        <span className="text-[10px] font-serif text-amber-500 tracking-widest font-semibold">COSMOGRAPHIA</span>
        <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-600" />
      </div>
    </div>
  );
}
