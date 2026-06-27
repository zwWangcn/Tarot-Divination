import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Sparkles, 
  HelpCircle, 
  Send, 
  RefreshCw, 
  Info, 
  ArrowRight, 
  Moon, 
  BookOpen, 
  Compass, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Globe
} from 'lucide-react';

import CosmicBackground from './components/CosmicBackground';
import CardBackSvg from './components/CardBackSvg';
import CardFrontSvg from './components/CardFrontSvg';
import DivinationLoading from './components/DivinationLoading';
import { MAJOR_ARCANA } from './data/tarotCards';
import { TRANSLATIONS } from './i18n';
import { TarotCard, SelectedCardState, TarotReadingResponse } from './types';

export default function App() {
  // App Language State: Simplified Chinese, English, Japanese
  const [lang, setLang] = useState<'zh' | 'en' | 'ja'>('zh');
  const dict = TRANSLATIONS[lang];

  // App Phase States
  const [step, setStep] = useState<'input' | 'pick' | 'loading' | 'result'>('input');
  
  // User Prompt State
  const [prompt, setPrompt] = useState('');
  
  // Deck State (12 cards displayed for selection)
  const [deck, setDeck] = useState<TarotCard[]>([]);
  
  // User Selection State (indices of selected cards from the 12 displayed)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  
  // Confirmed Selected Cards in order [Past, Present, Future]
  const [finalCards, setFinalCards] = useState<SelectedCardState[]>([]);
  
  // Polling State
  const [requestId, setRequestId] = useState<string | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);
  const [interpretation, setInterpretation] = useState<string>('');
  
  // Result card flipping states
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false]);

  // Shuffle 12 random cards from the 22 Major Arcana on load or reset
  const initDeck = () => {
    const shuffled = [...MAJOR_ARCANA].sort(() => Math.random() - 0.5);
    setDeck(shuffled.slice(0, 12));
    setSelectedIndices([]);
    setFinalCards([]);
    setFlippedCards([false, false, false]);
    setPollError(null);
    setInterpretation('');
    setRequestId(null);
  };

  useEffect(() => {
    initDeck();
  }, []);

  // Sync sample prompt when language shifts, if the previous prompt was a template or empty
  useEffect(() => {
    const currentTemplates = Object.values(TRANSLATIONS).flatMap(t => t.suggestedPrompts);
    if (!prompt || currentTemplates.includes(prompt)) {
      setPrompt(dict.suggestedPrompts[0]);
    }
  }, [lang]);

  // Handle card selection click
  const handleSelectCard = (index: number) => {
    if (selectedIndices.includes(index)) {
      // Deselect
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      if (selectedIndices.length < 3) {
        setSelectedIndices([...selectedIndices, index]);
      }
    }
  };

  // Move to card picking board
  const handleStartPicking = () => {
    if (!prompt.trim()) return;
    setStep('pick');
  };

  // Submit selected cards and prompt to backend API
  const handleStartReading = async () => {
    if (selectedIndices.length !== 3) return;

    setStep('loading');

    const chosenCards = selectedIndices.map((idx) => deck[idx]);

    try {
      const response = await fetch('/api/tarot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          lang: lang,
          cards: chosenCards.map((c) => ({
            id: c.id,
            nameEn: c.nameEn,
            nameZh: c.nameZh,
            nameJa: c.nameJa,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(
          lang === 'en' 
            ? 'The divination initiation failed. The celestial path has deviated.' 
            : lang === 'ja'
              ? '神託の儀式に失敗しました。星の軌道がズレています。'
              : '占卜仪式初始化失败，星轨发生偏斜。'
        );
      }

      const data: TarotReadingResponse = await response.json();
      setRequestId(data.request_id);
      
      // Start polling status
      startPolling(data.request_id);
    } catch (err: any) {
      console.error(err);
      setPollError(
        err.message || 
        (lang === 'en' 
          ? 'Network lost. Check your cosmic frequency connection.' 
          : lang === 'ja'
            ? '通信が切断されました。宇宙の調和度を確認してください。'
            : '网络连接失败，请检查您的宇宙频率。')
      );
      setStep('result');
    }
  };

  // Polling status from backend
  const startPolling = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/tarot/status?id=${id}`);
        if (!res.ok) {
          throw new Error(
            lang === 'en' 
              ? 'Could not link to the divination altar.' 
              : lang === 'ja'
                ? '占術の祭壇との通信を維持できません。'
                : '无法连接占卜祭坛。'
          );
        }

        const data: TarotReadingResponse = await res.json();
        
        if (data.status === 'DONE') {
          clearInterval(interval);
          
          // Re-map the received cards with full TarotCard definitions from client DB
          if (data.cards) {
            const mappedCards: SelectedCardState[] = data.cards.map((srvCard) => {
              const fullCard = MAJOR_ARCANA.find((m) => m.id === srvCard.id) || MAJOR_ARCANA[0];
              return {
                card: fullCard,
                isReversed: srvCard.isReversed,
                isFlipped: false,
                position: srvCard.position,
              };
            });
            setFinalCards(mappedCards);
          }
          
          setInterpretation(data.interpretation || '');
          setStep('result');
        } else if (data.status === 'ERROR') {
          clearInterval(interval);
          setPollError(
            data.error || 
            (lang === 'en' 
              ? 'The ritual encountered an obstacle.' 
              : lang === 'ja'
                ? '神託儀式の最中に何らかの障害が発生しました。'
                : '占卜仪轨遭遇阻碍，请重试。')
          );
          setStep('result');
        }
      } catch (err: any) {
        console.error(err);
        clearInterval(interval);
        setPollError(
          lang === 'en' 
            ? 'Stellar portal disconnected. Please return and re-summon.' 
            : lang === 'ja'
              ? '星の回廊との同調が途切れました。戻って再試行してください。'
              : '星空连接断开，请返回主页重新呼唤。'
        );
        setStep('result');
      }
    }, 1500); // Poll every 1.5s
  };

  // Flip result card
  const handleFlipResultCard = (index: number) => {
    const newFlipped = [...flippedCards];
    newFlipped[index] = !newFlipped[index];
    setFlippedCards(newFlipped);
  };

  // Restart divination
  const handleReset = () => {
    initDeck();
    setStep('input');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center z-10 px-4 md:px-8 py-6 select-none overflow-y-auto">
      {/* Mystical Interactive Background */}
      <CosmicBackground />

      {/* Main Header */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center z-10 mb-8 border-b border-[#b48257]/20 pb-4 gap-4">
        <div className="flex items-center space-x-2.5">
          <Compass className="w-7 h-7 text-[#dfa35c] animate-spin-slow" />
          <div>
            <h1 className="font-serif text-xl md:text-2xl font-bold tracking-[0.2em] text-[#f4ba70] uppercase">
              {dict.headerTitle}
            </h1>
            <p className="text-[7.5px] tracking-[0.3em] text-[#b48257]/60 font-serif uppercase">STARDUST CELESTIAL ORACLE</p>
          </div>
        </div>

        {/* Language Selector & AI badge Row */}
        <div className="flex items-center space-x-4">
          {/* Elegant Archival Language Selector */}
          <div className="flex items-center bg-[#130f0d]/90 border border-[#b48257]/30 rounded-lg p-0.5 overflow-hidden shadow-md">
            <div className="px-2 py-1 text-[#b48257]/70">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <button
              onClick={() => setLang('zh')}
              className={`text-[10px] font-serif px-2.5 py-1 rounded-md transition-all duration-300 font-semibold ${
                lang === 'zh'
                  ? 'bg-[#b48257] text-[#0d0908] shadow-sm'
                  : 'text-[#dfa35c]/70 hover:text-[#f4ba70] hover:bg-stone-900/50'
              }`}
              id="lang-zh-btn"
            >
              中
            </button>
            <button
              onClick={() => setLang('en')}
              className={`text-[10px] font-serif px-2.5 py-1 rounded-md transition-all duration-300 font-semibold ${
                lang === 'en'
                  ? 'bg-[#b48257] text-[#0d0908] shadow-sm'
                  : 'text-[#dfa35c]/70 hover:text-[#f4ba70] hover:bg-stone-900/50'
              }`}
              id="lang-en-btn"
            >
              EN
            </button>
            <button
              onClick={() => setLang('ja')}
              className={`text-[10px] font-serif px-2.5 py-1 rounded-md transition-all duration-300 font-semibold ${
                lang === 'ja'
                  ? 'bg-[#b48257] text-[#0d0908] shadow-sm'
                  : 'text-[#dfa35c]/70 hover:text-[#f4ba70] hover:bg-stone-900/50'
              }`}
              id="lang-ja-btn"
            >
              日
            </button>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#130f0d]/95 border border-[#b48257]/30 px-3 py-1.5 rounded-lg text-xs text-[#dfa35c] shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#f4ba70]" />
            <span className="font-serif text-[9.5px] tracking-[0.1em] font-semibold uppercase">{dict.headerBadge}</span>
          </div>
        </div>
      </header>

      {/* Interactive Main Body */}
      <main className="w-full max-w-5xl flex-1 flex flex-col justify-center items-center z-10">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: PROMPT INPUT */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-2xl bg-[#161210]/95 border border-[#b48257]/35 rounded-2xl p-6 md:p-9 shadow-[0_0_50px_rgba(180,130,87,0.08)] relative overflow-hidden"
              id="tarot-input-card"
            >
              {/* Sacred Corner Engraving brackets */}
              <div className="absolute top-2.5 left-2.5 w-5 h-5 border-t border-l border-[#b48257]/40" />
              <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t border-r border-[#b48257]/40" />
              <div className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b border-l border-[#b48257]/40" />
              <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b border-r border-[#b48257]/40" />

              <div className="text-center mb-8">
                <div className="inline-block p-3 rounded-full bg-[#201915] border border-[#b48257]/30 mb-3.5">
                  <Moon className="w-7 h-7 text-[#f4ba70]" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-[#f4ba70] font-semibold tracking-wider">
                  {dict.promptHeading}
                </h2>
                <p className="text-stone-400 text-xs md:text-sm mt-2.5 font-serif max-w-md mx-auto leading-relaxed">
                  {dict.promptSub}
                </p>
              </div>

              {/* Input Area */}
              <div className="space-y-5">
                <div className="relative">
                  <textarea
                    className="w-full h-32 bg-[#0c0a09]/95 border border-[#b48257]/20 focus:border-[#f4ba70]/60 rounded-xl p-4 text-xs md:text-sm text-stone-100 placeholder-stone-600 focus:outline-none transition-all duration-300 resize-none font-serif leading-relaxed"
                    placeholder={dict.promptPlaceholder}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    maxLength={300}
                    id="tarot-prompt-textarea"
                  />
                  <div className="absolute bottom-3 right-3 text-[9px] font-serif text-[#b48257]/40">
                    {prompt.length}/300
                  </div>
                </div>

                {/* Suggested Templates */}
                <div>
                  <h4 className="text-xs text-[#dfa35c] font-semibold mb-3 flex items-center gap-1.5 font-serif">
                    <BookOpen className="w-3.5 h-3.5 text-[#f4ba70]" /> {dict.suggestedPromptsLabel}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {dict.suggestedPrompts.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(item)}
                        className={`text-left text-[11px] bg-[#120f0e]/50 hover:bg-[#201815]/80 border transition-all duration-300 p-3.5 rounded-xl font-serif line-clamp-2 leading-relaxed ${
                          prompt === item 
                            ? 'border-[#f4ba70] text-[#f4ba70] bg-[#231a15]' 
                            : 'border-[#b48257]/15 hover:border-[#b48257]/40 text-stone-300'
                        }`}
                        id={`prompt-template-${idx}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleStartPicking}
                  disabled={!prompt.trim()}
                  className={`w-full py-4 mt-4 rounded-xl font-serif text-xs md:text-sm tracking-[0.2em] font-bold flex items-center justify-center space-x-2 border transition-all duration-500 shadow-lg uppercase ${
                    prompt.trim()
                      ? 'bg-gradient-to-r from-[#b48257] to-[#9c6a41] hover:from-[#cda379] hover:to-[#b48257] border-[#f4ba70]/30 text-[#0d0908] cursor-pointer shadow-amber-900/10 transform hover:scale-[1.01]'
                      : 'bg-stone-900/10 border-[#b48257]/10 text-stone-600 cursor-not-allowed'
                  }`}
                  id="start-picking-btn"
                >
                  <span>{dict.startBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CARD PICKING */}
          {step === 'pick' && (
            <motion.div
              key="pick"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex flex-col items-center justify-center py-4"
            >
              {/* Top Prompt Display Info */}
              <div className="w-full max-w-4xl bg-[#161210]/90 border border-[#b48257]/20 p-4 rounded-xl flex justify-between items-center gap-4 mb-8 shadow-md">
                <div className="flex items-center gap-2 text-xs text-stone-400 font-serif">
                  <HelpCircle className="w-4 h-4 text-[#dfa35c] flex-shrink-0" />
                  <span className="line-clamp-1">{dict.yourQuery} <strong className="text-[#f4ba70]">“{prompt}”</strong></span>
                </div>
                <button 
                  onClick={() => setStep('input')} 
                  className="text-[10px] font-serif text-[#dfa35c] hover:text-[#f4ba70] border border-[#b48257]/30 hover:border-[#b48257]/70 px-3 py-1 rounded-md transition-all duration-300 bg-stone-900/40 shrink-0"
                >
                  {dict.editQueryBtn}
                </button>
              </div>

              {/* Picking Instruction Title */}
              <div className="text-center mb-8">
                <h2 className="font-serif text-2xl md:text-3xl text-[#f4ba70] font-semibold tracking-wider">
                  {dict.selectCardsHeading}
                </h2>
                <p className="text-stone-400 text-xs mt-2.5 max-w-md mx-auto leading-relaxed font-serif">
                  {dict.selectCardsSub}
                </p>
                
                {/* Indicator Dots */}
                <div className="flex justify-center items-center gap-4 mt-6">
                  {[dict.past, dict.present, dict.future].map((pos, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-serif transition-all duration-300 ${
                        selectedIndices.length > i 
                          ? 'border-[#b48257] bg-[#231a15] text-[#f4ba70] shadow-[0_0_10px_rgba(180,130,87,0.15)]' 
                          : 'border-[#b48257]/15 bg-stone-900/10 text-stone-500'
                      }`}
                    >
                      {selectedIndices.length > i ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#b48257]" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full border border-[#b48257]/45" />
                      )}
                      <span>{pos}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cards Grid Table */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6 w-full max-w-4xl px-2 my-4">
                {deck.map((card, idx) => {
                  const isSelected = selectedIndices.includes(idx);
                  const selectedOrder = selectedIndices.indexOf(idx);
                  
                  return (
                    <motion.div
                      key={card.id}
                      onClick={() => handleSelectCard(idx)}
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      className={`relative aspect-[3/4] rounded-xl cursor-pointer overflow-hidden group select-none ${
                        isSelected 
                          ? 'ring-2 ring-[#f4ba70] ring-offset-2 ring-offset-[#0e0c0a] shadow-[0_0_25px_rgba(180,130,87,0.45)]' 
                          : 'opacity-90 hover:opacity-100 shadow-md'
                      }`}
                      id={`deck-card-${idx}`}
                    >
                      <CardBackSvg />
                      
                      {/* Selection overlay numbering */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#0e0c0a]/60 backdrop-blur-[0.5px] flex flex-col justify-center items-center z-20">
                          <div className="w-9 h-9 rounded-full bg-[#b48257] text-[#0d0908] flex items-center justify-center font-serif font-bold text-lg border border-[#f4ba70] shadow-md animate-pulse-slow">
                            {selectedOrder + 1}
                          </div>
                          <span className="text-[8px] font-serif text-[#f4ba70] mt-2 tracking-[0.2em] font-semibold uppercase">
                            {selectedOrder === 0 ? 'Past' : selectedOrder === 1 ? 'Present' : 'Future'}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Ritual Trigger Action */}
              <div className="mt-12 text-center w-full max-w-sm">
                <button
                  onClick={handleStartReading}
                  disabled={selectedIndices.length !== 3}
                  className={`w-full py-4 rounded-xl font-serif text-xs md:text-sm tracking-[0.2em] font-bold flex items-center justify-center space-x-2 border transition-all duration-500 shadow-lg uppercase ${
                    selectedIndices.length === 3
                      ? 'bg-gradient-to-r from-stone-900 to-stone-950 border-[#b48257]/50 text-[#f4ba70] hover:text-[#ffdca8] hover:border-[#f4ba70] cursor-pointer shadow-amber-950/10 transform hover:scale-[1.01]'
                      : 'bg-stone-900/10 border-[#b48257]/15 text-stone-600 cursor-not-allowed'
                  }`}
                  id="consult-cosmos-btn"
                >
                  <Sparkles className="w-4 h-4 animate-pulse text-[#dfa35c]" />
                  <span>{dict.consultBtn}</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: RITUAL LOADING (POLLING) */}
          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-center items-center py-8"
            >
              <DivinationLoading lang={lang} />
            </motion.div>
          )}

          {/* STEP 4: RESULT PAGE WITH 3D FLIPPING */}
          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center justify-center py-4"
            >
              {/* Polling/API Error Warning Block */}
              {pollError ? (
                <div className="w-full max-w-2xl bg-[#261512]/90 border border-red-500/30 p-6 rounded-2xl flex flex-col items-center text-center space-y-4 mb-8 shadow-lg">
                  <AlertTriangle className="w-12 h-12 text-red-500 animate-bounce" />
                  <h3 className="font-serif text-lg text-red-300 font-semibold">{dict.errorHeading}</h3>
                  <p className="text-stone-300 text-xs md:text-sm max-w-md font-serif leading-relaxed">{pollError}</p>
                  <button
                    onClick={handleReset}
                    className="mt-2 bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-red-300 text-xs px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center space-x-1.5 font-serif"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{dict.realignBtn}</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Results Heading */}
                  <div className="text-center mb-8 max-w-xl px-2">
                    <span className="text-[9px] font-serif text-[#b48257] tracking-[0.25em] font-bold uppercase">
                      {lang === 'en' ? 'CELESTIAL ETCHINGS' : lang === 'ja' ? '天球の刻印' : '天体刻印'}
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl text-[#f4ba70] font-semibold tracking-wider mt-2">
                      {dict.revelationHeading}
                    </h2>
                    <p className="text-stone-400 text-xs md:text-sm mt-3 font-serif leading-relaxed">
                      {dict.revelationSub} <span className="text-[#f4ba70] font-semibold">“{prompt}”</span>
                    </p>
                    <p className="text-[#dfa35c]/70 text-[10px] font-serif mt-4.5 tracking-wide flex items-center justify-center gap-1.5 border border-[#b48257]/20 bg-[#1c1411]/80 px-4 py-2 rounded-full inline-block shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#dfa35c]" />
                      <span>{dict.clickUnveil}</span>
                    </p>
                  </div>

                  {/* 3 Results Cards with 3D flip animation */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 w-full max-w-3xl px-4 mb-12">
                    {finalCards.map((item, idx) => {
                      const isFlipped = flippedCards[idx];
                      const posLabel = idx === 0 
                        ? (lang === 'en' ? 'Past' : lang === 'ja' ? '過去 (Past)' : '过去 (Past)') 
                        : idx === 1 
                          ? (lang === 'en' ? 'Present' : lang === 'ja' ? '現在 (Present)' : '现在 (Present)') 
                          : (lang === 'en' ? 'Future' : lang === 'ja' ? '未来 (Future)' : '未来 (Future)');
                      const posTheme = idx === 0 
                        ? 'border-[#a380f7]/20 bg-[#161226]/80 text-[#a380f7]' 
                        : idx === 1 
                          ? 'border-[#dfa35c]/20 bg-[#1c1610]/80 text-[#dfa35c]' 
                          : 'border-[#56b081]/20 bg-[#101b15]/80 text-[#56b081]';
                      
                      return (
                        <div key={idx} className="flex flex-col items-center">
                          {/* Position Banner */}
                          <div className={`text-[10px] md:text-xs font-serif py-1 px-4 border rounded-full mb-4 font-semibold tracking-widest uppercase shadow-sm ${posTheme}`}>
                            {posLabel}
                          </div>

                          {/* 3D Flip Container */}
                          <div 
                            className="w-full max-w-[200px] aspect-[3/4] perspective-1000 cursor-pointer relative group"
                            onClick={() => handleFlipResultCard(idx)}
                            id={`result-card-container-${idx}`}
                          >
                            <motion.div
                              animate={{ rotateY: isFlipped ? 180 : 0 }}
                              transition={{ duration: 0.6, ease: 'easeInOut' }}
                              className="w-full h-full transform-style-3d relative"
                            >
                              {/* CARD BACK (Front view before flip) */}
                              <div className="absolute inset-0 backface-hidden z-10 w-full h-full">
                                <CardBackSvg />
                                {/* Overlay hover copper gleam */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#b48257]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                              </div>

                              {/* CARD FRONT (Back view before flip, shown flipped 180 degrees) */}
                              <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full">
                                <CardFrontSvg card={item.card} isReversed={item.isReversed} lang={lang} />
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Written Interpretation Block */}
                  {interpretation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="w-full max-w-3xl bg-gradient-to-b from-[#14100e]/95 to-[#090706]/98 border border-[#b48257]/30 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
                      id="tarot-result-interpretation"
                    >
                      {/* Artistic Antique Corner brackets */}
                      <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#b48257]/30" />
                      <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#b48257]/30" />
                      <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#b48257]/30" />
                      <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#b48257]/30" />

                      {/* Header emblem */}
                      <div className="flex justify-center items-center space-x-3 opacity-80 mb-6">
                        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#b48257]/60" />
                        <span className="text-[10px] md:text-xs font-serif text-[#f4ba70] tracking-[0.25em] font-bold uppercase">
                          {dict.codexHeader}
                        </span>
                        <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#b48257]/60" />
                      </div>

                      {/* Rendered markdown reading */}
                      <div className="markdown-body text-stone-200 leading-relaxed font-serif text-sm md:text-base space-y-4">
                        <ReactMarkdown>{interpretation}</ReactMarkdown>
                      </div>

                      {/* Reset Divination trigger */}
                      <div className="mt-12 flex justify-center border-t border-[#b48257]/20 pt-8">
                        <button
                          onClick={handleReset}
                          className="px-8 py-3.5 rounded-xl font-serif text-xs md:text-sm tracking-[0.2em] font-bold bg-gradient-to-r from-[#b48257] to-[#9c6a41] hover:from-[#cda379] hover:to-[#b48257] border border-[#f4ba70]/30 text-[#0d0908] cursor-pointer shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-center space-x-2 uppercase"
                          id="restart-divination-btn"
                        >
                          <RotateCcw className="w-4 h-4 text-[#0d0908]" />
                          <span>{dict.restartBtn}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Decorative Mystical Footer */}
      <footer className="w-full max-w-5xl text-center border-t border-[#b48257]/15 pt-4 mt-8 z-10 flex flex-col md:flex-row justify-between items-center text-[9.5px] text-stone-500 gap-2 font-serif">
        <p className="tracking-[0.15em] font-semibold">{dict.footerVow}</p>
        <p className="font-sans text-[9px]">{dict.footerRights}</p>
      </footer>
    </div>
  );
}
