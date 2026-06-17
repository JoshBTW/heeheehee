import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Mail, Sparkles, Send, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { triggerSparkleSound } from '../utils/audio';

interface LetterEnvelopeProps {
  onEmitBurst: (x: number, y: number) => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export default function LetterEnvelope({ onEmitBurst, isMusicPlaying, onToggleMusic }: LetterEnvelopeProps) {
  const [envelopeState, setEnvelopeState] = useState<'closed' | 'opening' | 'open'>('closed');
  const [repliedContent, setRepliedContent] = useState('');
  const [replies, setReplies] = useState<string[]>(() => {
    const saved = localStorage.getItem('megan_replies');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSent, setIsSent] = useState(false);
  const sealRef = useRef<HTMLButtonElement | null>(null);

  const handleOpenEnvelope = (e: React.MouseEvent) => {
    if (envelopeState !== 'closed') return;
    
    triggerSparkleSound();
    onEmitBurst(e.clientX, e.clientY);
    
    setEnvelopeState('opening');

    // Trigger sequential animation timings
    setTimeout(() => {
      setEnvelopeState('open');
      // Sparkle bursts from the heart center of the letter sliding out
      onEmitBurst(window.innerWidth / 2, window.innerHeight * 0.3);
      setTimeout(() => {
        onEmitBurst(window.innerWidth / 2 - 120, window.innerHeight * 0.4);
        onEmitBurst(window.innerWidth / 2 + 120, window.innerHeight * 0.4);
      }, 300);
    }, 1200);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    triggerSparkleSound();
    onEmitBurst(e.clientX, e.clientY);
  };

  const handleMailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const textToSubmit = repliedContent.trim();
    if (!textToSubmit) {
      e.preventDefault();
      return;
    }

    triggerSparkleSound();
    onEmitBurst(window.innerWidth / 2, window.innerHeight * 0.6);

    const newReplies = [...replies, textToSubmit];
    setReplies(newReplies);
    localStorage.setItem('megan_replies', JSON.stringify(newReplies));

    // Clear content and show the saved alert after a split-second so the browser processes the mailto link click natively.
    setTimeout(() => {
      setRepliedContent('');
      setIsSent(true);
    }, 100);

    setTimeout(() => {
      setIsSent(false);
    }, 4500);
  };

  const handleRestart = () => {
    setEnvelopeState('closed');
  };

  const recipient = 'joshua_sheen@s2024.ssts.edu.sg';
  const subject = encodeURIComponent('A Keepsake Reply from Megan 💖');
  const body = encodeURIComponent(`Dearest Joshua,\n\n${repliedContent.trim()}\n\nWith love,\nMegan`);
  const mailtoUrl = repliedContent.trim()
    ? `mailto:${recipient}?subject=${subject}&body=${body}`
    : '#';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center font-serif">
      
      {/* Chapter header */}
      {envelopeState === 'closed' && (
        <div className="text-center mb-12">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#6d645a] bg-[#f9f7f2] border border-[#e5e1da] px-3 py-1 rounded">
            Chapter III &bull; The Vault Masterpiece
          </span>
          <h2 className="text-4xl font-serif text-[#2d2a26] tracking-tight mt-5">
            An Unveiled Message
          </h2>
          <p className="text-[#6d645a] max-w-md mx-auto text-xs sm:text-sm mt-3 font-serif italic leading-relaxed">
            Megan, the golden wax seal holds the final, most precious piece of this holiday keepsake. Break the seal to slide open the letter.
          </p>
        </div>
      )}

      {/* Main interactive compartment */}
      <div className="relative w-full flex flex-col items-center justify-center min-h-[480px]">
        
        <AnimatePresence mode="wait">
          {/* CLOSED OR OPENING ENVELOPE VIEW */}
          {(envelopeState === 'closed' || envelopeState === 'opening') && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.6 }}
              className="relative w-80 sm:w-96 h-64 sm:h-72 flex items-center justify-center cursor-pointer select-none"
              onClick={handleOpenEnvelope}
            >
              {/* Outer Envelope Shadow/Glow */}
              <div className="absolute inset-0 bg-[#ece6de]/40 rounded-xl blur-2xl opacity-80" />

              {/* Envelope Base Back Area - Warm Editorial craft paper styling */}
              <div className="absolute inset-0 bg-white border border-[#e5e1da] rounded-lg shadow-xl overflow-hidden flex flex-col justify-end">
                <div className="absolute inset-1.5 border border-[#e5e1da]/40 pointer-events-none rounded" />
                
                {/* Visual texture stamp mock markings */}
                <div className="absolute top-4 left-6 border border-[#c8bdae]/60 px-2 py-0.5 rotate-12 rounded text-[8px] font-sans uppercase font-bold text-[#6d645a]/60">
                  EST 2026 &bull; HOLIDAYS
                </div>
                <div className="absolute top-6 right-6 w-12 h-16 bg-[#f9f7f2] rounded border border-[#e5e1da] shadow-xs flex flex-col items-center justify-center text-[#2d2a26] font-serif">
                  <span className="text-lg">M</span>
                  <span className="text-[7px] tracking-wider uppercase font-sans font-bold text-[#6d645a]">Megan</span>
                </div>

                {/* Sender Indicator */}
                <div className="p-6 text-left relative z-10 font-sans">
                  <span className="text-[8px] font-bold tracking-widest text-[#6d645a] block mb-0.5">FROM:</span>
                  <span className="font-serif italic text-[#2d2a26] text-xs">Joshua, Your Dearest</span>
                  <span className="text-[8px] font-bold tracking-widest text-[#6d645a] block mt-2 mb-0.5">TO:</span>
                  <span className="font-serif italic text-rose-700 text-xs font-semibold">Megan (Le Xuan) 💖</span>
                </div>
              </div>

              {/* Envelope flap folded down (Visual) */}
              <svg
                viewBox="0 0 500 350"
                className={`absolute inset-0 w-full h-full drop-shadow-sm transition-transform duration-1000 origin-top z-10 ${
                  envelopeState === 'opening' ? '-rotate-x-180 pointer-events-none' : ''
                }`}
              >
                {/* Left/Right Diagonal flaps and Bottom Flap styled to look like elegant cotton paper */}
                <path d="M 0,350 L 250,175 L 500,350" fill="#ffffff" stroke="#e5e1da" strokeWidth="1" />
                <path d="M 0,0 L 250,175 L 500,0" fill="#fcfbf7" stroke="#e5e1da" strokeWidth="1.5" />
                <path d="M 0,0 L 0,350 L 160,175" fill="#fcfbf7" stroke="#e5e1da" strokeWidth="1" />
              </svg>

              {/* Golden Wax Seal */}
              {envelopeState === 'closed' && (
                <motion.button
                  ref={sealRef}
                  whileHover={{ scale: 1.12 }}
                  className="absolute z-30 w-16 h-16 rounded-full bg-gradient-to-br from-[#c8bdae] via-[#6d645a] to-[#2d2a26] border border-[#e5e1da] flex items-center justify-center shadow-lg cursor-pointer flex-col"
                  style={{ top: 'calc(50% - 15px)', left: 'calc(50% - 32px)' }}
                >
                  <Heart className="w-5 h-5 text-white fill-white pulse-heart" />
                  <span className="text-[7px] font-sans font-bold text-white tracking-widest uppercase mt-1">OPEN SEAL</span>
                </motion.button>
              )}

              {envelopeState === 'opening' && (
                <div 
                  className="absolute z-30 w-16 h-16 rounded-full bg-[#c8bdae]/30 border border-[#c8bdae] flex items-center justify-center animate-ping"
                  style={{ top: 'calc(50% - 15px)', left: 'calc(50% - 32px)' }}
                >
                  <Mail className="w-5 h-5 text-[#2d2a26]" />
                </div>
              )}
            </motion.div>
          )}

          {/* OPENED REVEALED LETTER VIEW */}
          {envelopeState === 'open' && (
            <motion.div
              key="letter-body"
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
              className="w-full max-w-2xl bg-white border border-[#e5e1da] rounded-lg p-8 sm:p-12 shadow-2xl relative overflow-hidden"
              style={{
                boxShadow: '0 20px 50px -15px rgba(109, 100, 90, 0.1)',
              }}
            >
              {/* Premium double gold frame boundary outlines */}
              <div className="absolute inset-4 border border-[#e5e1da]/40 rounded pointer-events-none" />
              <div className="absolute inset-[18px] border border-[#c8bdae]/20 rounded pointer-events-none" />

              {/* Watermark roses/hearts in coordinates */}
              <div className="absolute top-10 right-10 text-[#ece6de]/30 select-none pointer-events-none">
                <Heart className="w-24 h-24 stroke-1 fill-rose-50/10" />
              </div>
              <div className="absolute bottom-12 left-12 text-[#ece6de]/30 select-none pointer-events-none">
                <Heart className="w-16 h-16 stroke-1 fill-rose-50/10" />
              </div>

              {/* Music box / voice control in-letter widget */}
              <div className="mb-8 flex justify-between items-center relative z-10 border-b border-dashed border-[#e5e1da]/60 pb-4">
                <div className="flex items-center gap-1.5 font-sans">
                  <span className="text-xl">💌</span>
                  <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#6d645a] font-bold">
                    Unveiled Letter &bull; Correspondence
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={onToggleMusic}
                    className={`p-2 rounded-full border transition-all duration-300 ${
                      isMusicPlaying
                        ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-xs'
                        : 'bg-stone-50 text-stone-400 border-stone-200 hover:bg-stone-100'
                    }`}
                    title="Toggle background ambient melody"
                  >
                    {isMusicPlaying ? <Volume2 className="w-4 h-4 animate-bounce text-rose-500" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleRestart}
                    className="p-2 rounded-full border border-stone-200 text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors"
                    title="Re-seal Envelope"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sincere Content Section in elegant Editorial Typography */}
              <article className="prose prose-stone max-w-none text-[#2d2a26] relative z-10 font-serif tracking-wide">
                
                {/* Dearest Salutation */}
                <p className="font-serif italic text-2xl text-[#2d2a26] font-semibold mb-6">
                  My dearest Megan,
                </p>

                {/* Par 1 */}
                <p className="text-stone-700 leading-relaxed text-base sm:text-lg mb-6 indent-6">
                  Holidays have given me so much free time so I thought I&apos;ll make good use of it, making this. I love you, I know I say it a lot, just because I won&apos;t say enough in this life.
                </p>

                {/* Par 2 */}
                <p className="text-stone-700 leading-relaxed text-base sm:text-lg mb-6 indent-6">
                  I love you <strong className="text-rose-700 font-serif font-bold italic">le xuan</strong>, not only now, but in every breath I take, in every movement I make and with every word I speak, not only now, but in every lifetime, yesterday and tomorrow.
                </p>

                {/* Par 3 */}
                <p className="text-stone-700 leading-relaxed text-base sm:text-lg mb-6 indent-6">
                  You&apos;ve shown me a side of me I thought I would never unveil, but you have the key to my heart and that vault has been opened, and my love for you flows evermore.
                </p>

                {/* Par 4 */}
                <p className="text-stone-700 leading-relaxed text-base sm:text-lg mb-8 indent-6">
                  I never thought I&apos;d make all this for a girl but younger me would never expect to a dream like you to come into my life.
                </p>

                {/* Signature Block */}
                <div className="mt-12 text-right">
                  <p className="font-serif italic text-stone-500 text-sm">Forever and always yours,</p>
                  <p className="font-cursive text-5xl text-rose-600 mt-2 select-none font-bold">
                    Joshua
                  </p>
                </div>
              </article>

              {/* Heart burst interactive widget inside letter */}
              <div className="mt-12 bg-[#f9f7f2] border border-[#e5e1da] p-6 rounded relative z-10 text-center">
                <button
                  onClick={handleHeartClick}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d2a26] hover:bg-stone-800 text-white font-sans text-[10px] font-bold tracking-[0.2em] uppercase rounded transition-all duration-300 shadow-sm"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                  <span>Send Joshua a Heartburst ❤️</span>
                </button>
                <p className="text-[9px] text-[#6d645a] font-sans font-bold uppercase tracking-widest mt-3">
                  Tap the button to scatter romantic digital sparkles!
                </p>
              </div>

              {/* GUESTBOOK REPLY FORM FOR MEGAN */}
              <div className="mt-10 pt-8 border-t border-[#e5e1da]/60 relative z-10 text-left font-sans">
                <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-[#2d2a26] flex items-center gap-1.5 mb-3">
                  <Mail className="w-4 h-4 text-[#6d645a]" />
                  <span>Leave a Private Reply for Joshua</span>
                </h4>
                
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <textarea
                    placeholder="Type your warm thoughts here, Megan..."
                    value={repliedContent}
                    onChange={(e) => setRepliedContent(e.target.value)}
                    rows={3}
                    className="w-full bg-[#f9f7f2]/40 border border-[#e5e1da] rounded px-4 py-3 text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-rose-300 focus:border-[#c8bdae] transition-all font-sans"
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-stone-500 font-sans italic">
                      Opens email drafted for joshua_sheen@s2024.ssts.edu.sg
                    </span>
                    <a
                      href={mailtoUrl}
                      onClick={handleMailClick}
                      className={`px-5 py-2.5 rounded font-sans text-[10px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-1.5 ${
                        repliedContent.trim()
                          ? 'bg-[#2d2a26] text-white hover:bg-stone-800 cursor-pointer shadow-sm'
                          : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200 pointer-events-none'
                      }`}
                    >
                      <span>Send via Email</span>
                      <Send className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </form>

                {/* SENT MESSAGE POPUP */}
                <AnimatePresence>
                  {isSent && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-rose-700 font-serif italic mt-3 bg-rose-50/50 border border-rose-100 p-2.5 rounded text-center"
                    >
                      Your beautiful response was saved! A safe draft was prepared for joshua_sheen@s2024.ssts.edu.sg. Press send in your browser/email client to deliver! 💌
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* CHRONICLES LOG OF RESPONSES */}
                {replies.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h5 className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#6d645a]">
                      Megan&apos;s Responses Box ({replies.length})
                    </h5>
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                      {replies.map((reply, i) => (
                        <div key={i} className="bg-[#f9f7f2] border border-[#e5e1da] p-3 rounded text-xs text-stone-700 italic font-serif relative">
                          <span className="absolute top-2 right-2 text-[9px] text-[#6d645a]/50 font-sans font-bold">#{i + 1}</span>
                          &ldquo;{reply}&rdquo;
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
