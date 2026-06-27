import React from 'react';
import { TarotCard } from '../types';

interface CardFrontSvgProps {
  card: TarotCard;
  isReversed: boolean;
  lang?: 'zh' | 'en' | 'ja';
}

const ROMAN_NUMERALS: Record<string, string> = {
  '0_fool': '0',
  '1_magician': 'I',
  '2_high_priestess': 'II',
  '3_empress': 'III',
  '4_emperor': 'IV',
  '5_hierophant': 'V',
  '6_lovers': 'VI',
  '7_chariot': 'VII',
  '8_strength': 'VIII',
  '9_hermit': 'IX',
  '10_wheel_of_fortune': 'X',
  '11_justice': 'XI',
  '12_hanged_man': 'XII',
  '13_death': 'XIII',
  '14_temperance': 'XIV',
  '15_devil': 'XV',
  '16_tower': 'XVI',
  '17_star': 'XVII',
  '18_moon': 'XVIII',
  '19_sun': 'XIX',
  '20_judgement': 'XX',
  '21_world': 'XXI'
};

const ELEMENT_LABELS: Record<string, Record<'zh' | 'en' | 'ja', string>> = {
  fire: { zh: '火元素', en: 'Fire Element', ja: '火属性' },
  water: { zh: '水元素', en: 'Water Element', ja: '水属性' },
  air: { zh: '风元素', en: 'Air Element', ja: '風属性' },
  earth: { zh: '土元素', en: 'Earth Element', ja: '地属性' },
  spirit: { zh: '灵性', en: 'Spirit', ja: '霊性' }
};

// Vintage color themes matching copperplate engraving tones (amber, copper, bronze)
const ELEMENT_THEMES: Record<string, { bg: string, text: string, border: string, glow: string }> = {
  fire: { bg: 'bg-[#231510]', text: 'text-[#e26941]', border: 'border-[#e26941]/30', glow: 'shadow-[#e26941]/5' },
  water: { bg: 'bg-[#111926]', text: 'text-[#4ba3e3]', border: 'border-[#4ba3e3]/30', glow: 'shadow-[#4ba3e3]/5' },
  air: { bg: 'bg-[#161226]', text: 'text-[#a380f7]', border: 'border-[#a380f7]/30', glow: 'shadow-[#a380f7]/5' },
  earth: { bg: 'bg-[#101b15]', text: 'text-[#56b081]', border: 'border-[#56b081]/30', glow: 'shadow-[#56b081]/5' },
  spirit: { bg: 'bg-[#1c1610]', text: 'text-[#dfa35c]', border: 'border-[#dfa35c]/30', glow: 'shadow-[#dfa35c]/5' }
};

export default function CardFrontSvg({ card, isReversed, lang = 'zh' }: CardFrontSvgProps) {
  const activeLang = lang === 'en' || lang === 'ja' || lang === 'zh' ? lang : 'zh';
  const romanNum = ROMAN_NUMERALS[card.id] || 'I';
  const theme = ELEMENT_THEMES[card.element] || ELEMENT_THEMES.spirit;
  const elementLabel = ELEMENT_LABELS[card.element][activeLang];

  // Multilingual card name mapping
  const cardName = activeLang === 'en' ? card.nameEn : activeLang === 'ja' ? card.nameJa : card.nameZh;
  const cardSubtitle = activeLang === 'en' ? 'Arcana' : card.nameEn;

  // Keyowrds list by language
  const keywords = activeLang === 'en' ? card.keywordsEn : activeLang === 'ja' ? card.keywordsJa : card.keywordsZh;

  return (
    <div 
      className={`w-full h-full relative bg-[#130f0d] rounded-xl border border-[#b48257]/50 overflow-hidden shadow-2xl flex flex-col justify-between items-center p-3 select-none ${isReversed ? 'rotate-180' : ''}`}
      style={{ boxShadow: '0 12px 36px -12px rgba(180, 130, 87, 0.4)' }}
    >
      {/* Woodcut Paper Texture Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0a0807]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#b48257] via-[#945f37] to-transparent opacity-[0.04] mix-blend-color-dodge" />

      {/* Double fine engraved frame lines */}
      <div className="absolute inset-1.5 border border-[#b48257]/20 rounded-lg pointer-events-none" />
      <div className="absolute inset-2 border border-dashed border-[#b48257]/10 rounded-lg pointer-events-none" />

      {/* Header with Roman Numerals & Archival Tags */}
      <div className="w-full flex justify-between items-center px-2 pt-1.5 z-10">
        <span className="text-[10px] font-mono text-[#b48257]/70 font-semibold">{romanNum}</span>
        <div className="flex space-x-1 items-center">
          <span className="w-1 h-1 rounded-full bg-[#b48257]/60" />
          <span className="text-[6.5px] font-serif text-[#b48257]/45 tracking-[0.25em] uppercase">
            {activeLang === 'en' ? 'MAJOR ARCANA' : activeLang === 'ja' ? '大アルカナ' : '大阿尔卡那'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#b48257]/70 font-semibold">{romanNum}</span>
      </div>

      {/* Main Engraved Art Area */}
      <div className="relative flex-1 w-full max-h-[190px] my-2.5 rounded-lg border border-[#b48257]/15 overflow-hidden bg-[#0c0a09]/95 p-4 flex flex-col items-center justify-center z-10">
        {/* Concentric planetary orbits in background */}
        <div className="absolute w-28 h-28 border border-[#b48257]/5 rounded-full animate-orbit" />
        <div className="absolute w-36 h-36 border border-dashed border-[#b48257]/8 rounded-full animate-reverse-orbit" />
        
        {/* Hand-sketched woodcut cross-hatches */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none select-none" style={{
          backgroundImage: 'radial-gradient(circle, #b48257 1px, transparent 1px)',
          backgroundSize: '12px 12px'
        }} />

        {/* Dynamic Icon styled like a rustic copperplate print */}
        <div className={`relative p-5 rounded-full border ${theme.border} ${theme.bg} shadow-md ${theme.glow} z-10 mb-2.5 transform transition-transform duration-500 hover:scale-105`}>
          {/* Subtle concentric details around icon */}
          <div className="absolute inset-1 border border-[#b48257]/10 rounded-full" />
          <svg
            className={`w-9 h-9 ${theme.text} filter drop-shadow-[0_0_6px_rgba(180,130,87,0.15)]`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={card.symbol} />
          </svg>
        </div>

        {/* Vintage Element badge */}
        <span className={`text-[8px] px-2 py-0.5 rounded-full border ${theme.border} ${theme.bg} ${theme.text} tracking-[0.15em] font-serif font-semibold z-10`}>
          {elementLabel}
        </span>
      </div>

      {/* Title & Keywords Area */}
      <div className="w-full flex flex-col items-center z-10 pb-1">
        <h3 className="font-serif text-[17px] text-[#f4ba70] tracking-wider font-medium mb-0.5 text-center px-1">
          {cardName}
        </h3>
        <p className="text-[8.5px] font-serif text-[#b48257]/50 uppercase tracking-[0.2em] mb-2 font-bold">
          {cardSubtitle}
        </p>

        {/* Copperplate Keywords Badges */}
        <div className="flex gap-1 justify-center max-w-[170px] overflow-hidden flex-wrap">
          {keywords.slice(0, 3).map((keyword, i) => (
            <span 
              key={i} 
              className="text-[8px] bg-[#1a1411]/80 border border-[#b48257]/20 px-1.5 py-0.5 rounded text-[#dfa35c] font-serif tracking-wide shrink-0"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Direction indicator (Reversed tag if reversed) */}
      {isReversed && (
        <div className="absolute top-[50%] left-1.5 -translate-y-1/2 rotate-90 origin-left text-[7px] font-serif font-bold tracking-[0.15em] text-red-500 bg-[#1f0f0c] border border-red-500/20 px-1.5 py-0.5 rounded uppercase pointer-events-none z-20 shadow-md">
          {activeLang === 'en' ? 'REVERSED' : activeLang === 'ja' ? '逆位置' : '逆位'}
        </div>
      )}
    </div>
  );
}
