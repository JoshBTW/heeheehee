import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Heart, ShieldAlert, Sparkles, Music, Music2 } from 'lucide-react';
import { triggerSparkleSound } from '../utils/audio';

interface WelcomeStageProps {
  onUnlock: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export default function WelcomeStage({ onUnlock, isMusicPlaying, onToggleMusic }: WelcomeStageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [unlockedState, setUnlockedState] = useState<'locked' | 'unlocking' | 'error'>('locked');
  const [inputName, setInputName] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleUnlockAttempt = () => {
    const formatted = inputName.trim().toLowerCase();
    
    // Check if the user inputted Megan, Le Xuan, or Xuan
    if (formatted.includes('megan') || formatted.includes('xuan') || formatted.includes('le xuan') || formatted.includes('meg')) {
      triggerSparkleSound();
      setUnlockedState('unlocking');
      setTimeout(() => {
        onUnlock();
      }, 1500);
    } else {
      setUnlockedState('error');
      // Shake animation trigger
      setTimeout(() => setUnlockedState('locked'), 1200);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 py-8">
      {/* Absolute top right Music control specifically customized */}
      <div className="absolute top-0 right-4 z-10 flex items-center gap-2">
        <button
          onClick={onToggleMusic}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
            isMusicPlaying
              ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
              : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
          }`}
          title="Toggle soft romantic music box"
        >
          {isMusicPlaying ? (
            <>
              <Music className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Music On 💖</span>
            </>
          ) : (
            <>
              <Music2 className="w-3.5 h-3.5" />
              <span>Music Off 🔇</span>
            </>
          )}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white border border-[#e5e1da] rounded-2xl p-10 shadow-2xl text-center relative overflow-hidden"
        style={{
          boxShadow: '0 20px 40px -15px rgba(109, 100, 90, 0.08), 0 1px 3px rgba(0,0,0,0.01)'
        }}
      >
        {/* Double thin gilded borders inside to mimic luxurious publishing stationary */}
        <div className="absolute inset-2 border border-[#e5e1da]/40 rounded-xl pointer-events-none" />
        <div className="absolute inset-2.5 border border-[#c8bdae]/20 rounded-xl pointer-events-none" />

        {/* Top Header */}
        <div className="mb-8 relative z-10">
          <span className="text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-[#6d645a] bg-[#f9f7f2] border border-[#e5e1da] px-3 py-1 rounded inline-block">
            Personal Keepsake
          </span>
          <h1 className="text-3xl font-serif text-[#2d2a26] mt-4 tracking-tight">
            The Locked Vault
          </h1>
          <p className="text-xs text-[#6d645a] mt-2 font-serif italic">
            An interactive correspondence compiled for one special soul.
          </p>
        </div>

        {/* Dynamic Key / Lock Visual */}
        <div className="my-8 flex justify-center items-center h-44 relative z-10">
          <AnimatePresence mode="wait">
            {unlockedState === 'locked' && (
              <motion.div
                key="locked-view"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div 
                  className="relative cursor-pointer group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {/* Glowing background ring */}
                  <div className="absolute inset-0 bg-[#ece6de] rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500 scale-125" />
                  
                  <div className="w-24 h-24 rounded-full bg-[#f9f7f2] border border-[#e5e1da] flex items-center justify-center shadow-sm relative z-10">
                    <Heart 
                      className={`w-10 h-10 text-rose-500 transition-all duration-500 ${
                        isHovered ? 'scale-110 text-rose-600 fill-rose-100' : ''
                      }`} 
                    />
                    <Key className="w-5.5 h-5.5 text-stone-500 absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-sm border border-stone-100 transform group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>
                <p className="text-[10px] text-stone-400 mt-4 font-sans tracking-widest uppercase font-bold">STATUS: SECURED & PRIVATE</p>
              </motion.div>
            )}

            {unlockedState === 'unlocking' && (
              <motion.div
                key="unlocking-view"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full bg-rose-50 border border-rose-150 flex items-center justify-center relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  >
                    <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
                  </motion.div>
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 border border-dashed border-rose-400 rounded-full"
                  />
                </div>
                <p className="text-[10px] text-rose-600 mt-4 font-sans font-bold tracking-widest uppercase animate-pulse">
                  UNLOCKING SOUL VAULT...
                </p>
              </motion.div>
            )}

            {unlockedState === 'error' && (
              <motion.div
                key="error-view"
                initial={{ x: [-10, 10, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-red-600"
              >
                <div className="w-24 h-24 rounded-full bg-red-50/50 border border-red-200 flex items-center justify-center shadow-inner">
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <p className="text-[10px] text-red-600 mt-4 font-sans tracking-widest font-bold uppercase">
                  NAME DOES NOT UNLOCK THE KEY
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input verification */}
        <div className="space-y-4 relative z-10">
          <div className="text-left">
            <label className="block text-[9px] font-sans font-bold text-[#6d645a] uppercase tracking-widest mb-1.5">
              Who holds the key to Joshua's heart?
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your beautiful name..."
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlockAttempt()}
                className="w-full bg-[#f9f7f2]/50 border border-[#e5e1da] rounded-lg px-4 py-3 text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-rose-300 focus:border-[#c8bdae] transition-all font-sans"
              />
              <Sparkles className="absolute right-3.5 top-3.5 w-3.5 h-3.5 text-stone-300" />
            </div>
          </div>

          <button
            onClick={handleUnlockAttempt}
            disabled={!inputName.trim() || unlockedState === 'unlocking'}
            className={`w-full py-3 rounded-lg font-sans text-[10px] font-bold tracking-[0.2em] uppercase shadow transition-all duration-300 flex items-center justify-center gap-2 ${
              inputName.trim()
                ? 'bg-[#2d2a26] text-white hover:bg-stone-800 cursor-pointer transform hover:-translate-y-0.5'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
            }`}
          >
            Insert Key & Unlock 💖
          </button>

          <div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-[10px] font-sans text-stone-400 hover:text-stone-600 underline tracking-wider transition-colors"
            >
              {showHint ? "Hide Hint" : "Need a Hint?"}
            </button>
            <AnimatePresence>
              {showHint && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-stone-500 mt-2 italic font-serif leading-relaxed overflow-hidden"
                >
                  "Dearest... I love you le xuan" (Try entering "Megan" or "Le Xuan")
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
