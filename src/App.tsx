import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Key, Ticket, Mail, Volume2, VolumeX, Sparkles } from 'lucide-react';
import WelcomeStage from './components/WelcomeStage';
import MemoriesStage from './components/MemoriesStage';
import CouponsStage from './components/CouponsStage';
import LetterEnvelope from './components/LetterEnvelope';
import { FallingSparkles, SparkleEmitterRef } from './components/FallingSparkles';
import { startAmbientMusic, stopAmbientMusic } from './utils/audio';

export default function App() {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const sparklesRef = useRef<SparkleEmitterRef>(null);

  // Stop music on unmount
  useEffect(() => {
    return () => {
      stopAmbientMusic();
    };
  }, []);

  const handleToggleMusic = () => {
    if (isMusicPlaying) {
      stopAmbientMusic();
      setIsMusicPlaying(false);
    } else {
      // Start context and pass an optional callback when a note sounds
      startAmbientMusic((freq) => {
        // Occasionally trigger a soft visual burst on the screen depending on current window dimensions
        if (sparklesRef.current && Math.random() > 0.6) {
          const rx = Math.random() * window.innerWidth;
          const ry = Math.random() * (window.innerHeight * 0.4);
          sparklesRef.current.burst(rx, ry, 6);
        }
      });
      setIsMusicPlaying(true);
      
      // Emit a little sparkle burst at the center
      if (sparklesRef.current) {
        sparklesRef.current.burst(window.innerWidth / 2, window.innerHeight / 2, 12);
      }
    }
  };

  const handleUnlockHeart = () => {
    // Advanced to intermediate view (Reasons Stage)
    setActiveStage(1);
    
    // Automatically turn on soft ambient music to enhance the emotion
    if (!isMusicPlaying) {
      handleToggleMusic();
    }
  };

  const emitBurstInApp = (x: number, y: number) => {
    if (sparklesRef.current) {
      sparklesRef.current.burst(x, y, 22);
    }
  };

  // Stage labels representing their love story pipeline
  const STAGES_INFO = [
    { label: 'The Lock', icon: Key },
    { label: 'My Reasons', icon: Heart },
    { label: 'Promises', icon: Ticket },
    { label: 'The Letter', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-[#f9f7f2] text-[#2d2a26] font-serif md:border-[16px] md:border-white box-border selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden pb-16 relative">
      {/* Sparkles Particle Layer acting at top most viewport index */}
      <FallingSparkles ref={sparklesRef} density={0.4} />

      {/* Decorative luxury coordinates accent light background */}
      <div className="absolute left-6 bottom-24 hidden md:flex flex-col select-none pointer-events-none">
        <span className="text-[72px] font-bold text-[#e5e1da] leading-none select-none select-none tracking-tight">ENDLESS</span>
        <span className="text-[9px] font-sans uppercase tracking-[0.5em] ml-1.5 text-stone-400">A collection of moments</span>
      </div>

      {/* HEADER BAR */}
      <header className="relative w-full max-w-5xl mx-auto px-8 pt-10 pb-6 flex flex-col sm:flex-row justify-between items-start gap-4 z-10 border-b border-[#e5e1da]">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.3em] font-sans font-bold uppercase mb-1 opacity-60 text-stone-500">
            Personal Correspondence
          </span>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl italic font-serif text-[#2d2a26]">For Megan.</h1>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="text-rose-500 cursor-pointer"
              title="Joshua loves you"
            >
              ❤️
            </motion.div>
          </div>
        </div>

        <div className="flex items-center sm:items-end flex-col gap-2 w-full sm:w-auto">
          <span className="text-[10px] tracking-[0.3em] font-sans font-bold uppercase opacity-60 italic text-stone-500">
            Volume 01 &mdash; Holidays Keepsake
          </span>
          
          {/* Floating global music toggle option once Megan unlocks the Vault */}
          {activeStage > 0 && (
            <button
              onClick={handleToggleMusic}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-sans font-bold tracking-widest uppercase border transition-all duration-300 shadow-sm cursor-pointer ${
                isMusicPlaying
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
              }`}
            >
              {isMusicPlaying ? (
                <>
                  <Volume2 className="w-3 h-3 animate-bounce" />
                  <span>Music On 💖</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3" />
                  <span>Music Off 🔇</span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTAINER PLATFORM */}
      <main className="relative z-10 w-full flex flex-col items-center">
        
        {/* PIPELINE NAVIGATION TIMELINE (Show after unlocking Stage 0) */}
        {activeStage > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl px-6 my-10"
          >
            <div className="bg-white/80 backdrop-blur-md border border-stone-100 rounded-2xl p-4 flex justify-between items-center relative shadow-sm">
              <div className="absolute inset-x-8 top-[38px] h-0.5 bg-stone-100 z-0" />
              
              {/* Active navigation timeline filling bar */}
              <div 
                className="absolute left-8 top-[38px] h-0.5 bg-gradient-to-r from-romantic-400 to-rose-500 z-0 transition-all duration-700" 
                style={{ width: `${(activeStage / (STAGES_INFO.length - 1)) * 88}%` }}
              />

              {STAGES_INFO.map((stage, i) => {
                const Icon = stage.icon;
                const isCompleted = activeStage > i;
                const isActive = activeStage === i;

                return (
                  <button
                    key={i}
                    onClick={() => i <= activeStage && setActiveStage(i)}
                    className={`relative z-10 flex flex-col items-center w-16 group transition-all duration-500 ${
                      i <= activeStage ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-500 shadow-sm ${
                        isActive
                          ? 'bg-rose-500 border-rose-600 text-white scale-110 shadow-rose-200'
                          : isCompleted
                          ? 'bg-rose-100 border-rose-200 text-rose-600'
                          : 'bg-stone-50 border-stone-200 text-stone-400 group-hover:bg-stone-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span 
                      className={`text-[10px] font-mono tracking-tight mt-2 uppercase transition-all ${
                        isActive ? 'text-rose-600 font-bold' : 'text-stone-400'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STAGES CONTENT SWITCHER CONTROLLER */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeStage === 0 && (
              <motion.div
                key="stage-0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
              >
                <WelcomeStage 
                  onUnlock={handleUnlockHeart} 
                  isMusicPlaying={isMusicPlaying}
                  onToggleMusic={handleToggleMusic}
                />
              </motion.div>
            )}

            {activeStage === 1 && (
              <motion.div
                key="stage-1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
              >
                <MemoriesStage 
                  onNext={() => setActiveStage(2)} 
                  onEmitBurst={emitBurstInApp}
                />
              </motion.div>
            )}

            {activeStage === 2 && (
              <motion.div
                key="stage-2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
              >
                <CouponsStage 
                  onNext={() => setActiveStage(3)} 
                  onEmitBurst={emitBurstInApp}
                />
              </motion.div>
            )}

            {activeStage === 3 && (
              <motion.div
                key="stage-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <LetterEnvelope 
                  onEmitBurst={emitBurstInApp} 
                  isMusicPlaying={isMusicPlaying}
                  onToggleMusic={handleToggleMusic}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-5xl mx-auto px-8 pb-10 mt-20 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-[#2d2a26]/70 border-t border-[#e5e1da] pt-10">
        <div className="flex space-x-12">
          <div>
            <span className="block text-[9px] font-sans font-bold uppercase tracking-widest opacity-40 mb-1">Latitude</span>
            <span className="text-[13px] italic font-serif tabular-nums">1.3521° N</span>
          </div>
          <div>
            <span className="block text-[9px] font-sans font-bold uppercase tracking-widest opacity-40 mb-1">Longitude</span>
            <span className="text-[13px] italic font-serif tabular-nums">103.8198° E</span>
          </div>
          <div>
            <span className="block text-[9px] font-sans font-bold uppercase tracking-widest opacity-40 mb-1">Recipient</span>
            <span className="text-[13px] italic font-serif">Megan (Le Xuan)</span>
          </div>
        </div>

        <div className="max-w-xs text-left sm:text-right font-sans text-[10px] leading-relaxed opacity-50">
          <p>
            I never thought I&apos;d make all this for a girl but younger me would never expect a dream like you to come into my life.
          </p>
          <p className="mt-1.5 font-bold uppercase tracking-[0.2em] text-[8px]">
            &copy; 2026 Joshua • Personal Keepsake
          </p>
        </div>
      </footer>
    </div>
  );
}
