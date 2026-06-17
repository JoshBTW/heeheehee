import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Heart, ArrowRight, BookOpen, Quote } from 'lucide-react';
import { REASONS_TO_LOVE } from '../data';
import { triggerSparkleSound } from '../utils/audio';

interface MemoriesStageProps {
  onNext: () => void;
  onEmitBurst: (x: number, y: number) => void;
}

export default function MemoriesStage({ onNext, onEmitBurst }: MemoriesStageProps) {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [readCount, setReadCount] = useState<Record<string, boolean>>({});

  const handleCardClick = (id: string, e: React.MouseEvent) => {
    triggerSparkleSound();
    
    // Emit sparkles around click coordinate
    onEmitBurst(e.clientX, e.clientY);
    
    setFlippedCardId(flippedCardId === id ? null : id);
    setReadCount((prev) => ({ ...prev, [id]: true }));
  };

  const allRead = REASONS_TO_LOVE.every((reason) => readCount[reason.id]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Header section with beautiful typography pairing */}
      <div className="text-center mb-12">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#6d645a] bg-[#f9f7f2] border border-[#e5e1da] px-3 py-1 rounded">
          Chapter I &bull; Sparking the Flow
        </span>
        <h2 className="text-4xl font-serif text-[#2d2a26] tracking-tight mt-5">
          Why My Love Flows
        </h2>
        <p className="text-[#6d645a] max-w-lg mx-auto text-xs sm:text-sm mt-3 font-serif italic leading-relaxed">
          Megan, you are the holder of the key. View each personal chronicle from my heart&apos;s vault.
        </p>
      </div>

      {/* Grid of 3D-feeling cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {REASONS_TO_LOVE.map((reason, idx) => {
          const isFlipped = flippedCardId === reason.id;
          const hasBeenRead = readCount[reason.id];

          return (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              onClick={(e) => handleCardClick(reason.id, e)}
              className="relative h-64 w-full cursor-pointer group"
              style={{ perspective: '1000px' }}
            >
              {/* Inner card containing the 3D flipping container */}
              <div
                className="w-full h-full relative transition-all duration-700 ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front Side */}
                <div
                  className={`absolute inset-0 bg-white border ${
                    hasBeenRead ? 'border-[#e5e1da] shadow-sm' : 'border-[#c8bdae] shadow-md'
                  } rounded-lg p-6 flex flex-col justify-between overflow-hidden romantic-glow-hover`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="absolute inset-1.5 border border-[#e5e1da]/45 rounded pointer-events-none" />
                  
                  {/* Pastel background circular mesh */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#ece6de]/30 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <span className="text-3xl p-2.5 bg-[#f9f7f2] border border-[#e5e1da] rounded-lg inline-block">
                      {reason.emoji}
                    </span>
                    {!hasBeenRead && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                    )}
                  </div>

                  <div className="relative z-10 mt-4">
                    <h3 className="text-lg font-serif text-[#2d2a26] font-semibold group-hover:text-rose-600 transition-colors">
                      {reason.title}
                    </h3>
                    <p className="text-stone-500 text-xs sm:text-sm font-sans mt-1.5 line-clamp-2 leading-relaxed">
                      {reason.text}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px] font-sans uppercase font-bold tracking-widest text-[#6d645a] group-hover:text-rose-600 transition-colors self-end relative z-10">
                    <span>Uncover</span>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </div>
                </div>

                {/* Back Side */}
                <div
                  className="absolute inset-0 bg-white border border-[#c8bdae] shadow-inner rounded-lg p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="absolute inset-1.5 border border-[#e5e1da]/45 rounded pointer-events-none" />
                  
                  <div className="flex items-start gap-3 relative z-10">
                    <Quote className="w-7 h-7 text-[#ece6de] shrink-0" />
                    <div>
                      <h4 className="font-serif text-[#2d2a26] text-base font-semibold italic">
                        {reason.title}
                      </h4>
                      <p className="text-stone-700 text-xs sm:text-sm mt-3 font-serif leading-relaxed whitespace-pre-line">
                        {reason.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 self-end text-[9px] font-sans font-bold uppercase tracking-widest text-[#6d645a] relative z-10">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-100" />
                    <span>Return</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic progression indicator footer */}
      <div className="flex flex-col items-center gap-4 mt-12 bg-white border border-[#e5e1da] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-[#6d645a]" />
          <div className="text-xs font-sans font-bold uppercase tracking-widest text-[#2d2a26]">
            {allRead ? (
              <span className="text-rose-600 font-bold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                All vaults unlocked • Let&apos;s read on
              </span>
            ) : (
              <span>
                Chronicles Explored: {Object.keys(readCount).length} / {REASONS_TO_LOVE.length}
              </span>
            )}
          </div>
        </div>

        {/* Dynamic progress bar */}
        <div className="w-full max-w-sm h-1 bg-stone-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#2d2a26]"
            initial={{ width: 0 }}
            animate={{ width: `${(Object.keys(readCount).length / REASONS_TO_LOVE.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <button
          onClick={onNext}
          className={`px-8 py-3 rounded-lg font-sans text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 ${
            allRead
              ? 'bg-[#2d2a26] text-white hover:bg-stone-800 cursor-pointer hover:shadow shadow-sm'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
          }`}
        >
          <span>Megan, Proceed</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
