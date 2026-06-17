import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Ticket, CheckCircle2, AlertCircle, ArrowRight, Heart } from 'lucide-react';
import { LOVE_COUPONS } from '../data';
import { LoveCoupon } from '../types';
import { triggerSparkleSound } from '../utils/audio';

interface CouponsStageProps {
  onNext: () => void;
  onEmitBurst: (x: number, y: number) => void;
}

export default function CouponsStage({ onNext, onEmitBurst }: CouponsStageProps) {
  // Load coupons from localStorage to keep state persistent during Megan's visits.
  const [coupons, setCoupons] = useState<LoveCoupon[]>(() => {
    const saved = localStorage.getItem('megan_coupons');
    if (saved) {
      try {
        const savedCoupons = JSON.parse(saved);
        if (Array.isArray(savedCoupons)) {
          // Align with the updated LOVE_COUPONS structure, preserving isRedeemed where ids match
          return LOVE_COUPONS.map(current => {
            const savedMatch = savedCoupons.find(s => s.id === current.id);
            if (savedMatch) {
              return { 
                ...current, 
                isRedeemed: savedMatch.isRedeemed, 
                redeemedAt: savedMatch.redeemedAt 
              };
            }
            return current;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return LOVE_COUPONS;
  });

  const [activeCoupon, setActiveCoupon] = useState<LoveCoupon | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('megan_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const handleRedeemClick = (coupon: LoveCoupon) => {
    if (coupon.isRedeemed) return;
    triggerSparkleSound();
    setActiveCoupon(coupon);
    setShowRedeemModal(true);
  };

  const confirmRedemption = (e: React.MouseEvent) => {
    if (!activeCoupon) return;
    
    // Sparkle coordinates at button position
    onEmitBurst(e.clientX, e.clientY);
    
    const now = new Date().toLocaleString();
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === activeCoupon.id
          ? { ...c, isRedeemed: true, redeemedAt: now }
          : c
      )
    );
    
    // Spawn massive multi-burst center sparklers
    onEmitBurst(window.innerWidth / 2, window.innerHeight * 0.4);
    setTimeout(() => {
      onEmitBurst(window.innerWidth / 2 - 100, window.innerHeight * 0.4);
      onEmitBurst(window.innerWidth / 2 + 100, window.innerHeight * 0.4);
    }, 250);

    setShowRedeemModal(false);
  };

  const resetCoupons = () => {
    if (window.confirm("Do you want to refresh and reset all coupons back to ready?")) {
      setCoupons(LOVE_COUPONS);
      localStorage.removeItem('megan_coupons');
    }
  };

  const totalRedeemed = coupons.filter(c => c.isRedeemed).length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 font-serif">
      {/* Header section with cute elements */}
      <div className="text-center mb-12">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#6d645a] bg-[#f9f7f2] border border-[#e5e1da] px-3 py-1 rounded">
          Chapter II &bull; Promises &amp; Tokens
        </span>
        <h2 className="text-4xl font-serif text-[#2d2a26] tracking-tight mt-5">
          Megan&apos;s Love coupons
        </h2>
        <p className="text-[#6d645a] max-w-lg mx-auto text-xs sm:text-sm mt-3 font-serif italic leading-relaxed">
          These are formal receipts of commitment. You can redeem them virtually right now, then present them in real life to Joshua!
        </p>
      </div>

      {/* Grid containing tickets */}
      <div className="space-y-6">
        {coupons.map((coupon, idx) => {
          return (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -25 : 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative bg-white border border-[#e5e1da] rounded-lg overflow-hidden shadow-sm flex flex-col md:flex-row hover:shadow-md transition-all duration-300"
            >
              {/* Inner double border decorative padding */}
              <div className="absolute inset-x-1.5 md:inset-1.5 top-1.5 bottom-1.5 border border-[#e5e1da]/40 pointer-events-none rounded" />

              {/* Left Ticket Stub (Emoji / Graphics) */}
              <div className="bg-[#f9f7f2] p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-dashed border-[#c8bdae] w-full md:w-36 shrink-0 relative">
                {/* Visual half circles on horizontal dashed border for vintage ticket look */}
                <div className="hidden md:block absolute -top-3 -right-3 w-6 h-6 bg-[#f9f7f2] rounded-full border border-[#e5e1da]" />
                <div className="hidden md:block absolute -bottom-3 -right-3 w-6 h-6 bg-[#f9f7f2] rounded-full border border-[#e5e1da]" />

                <span className="text-5xl filter drop-shadow select-none mb-1">
                  {coupon.emoji}
                </span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#6d645a] mt-2">
                  STUB
                </span>
              </div>

              {/* Main Ticket body */}
              <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-serif font-bold text-[#2d2a26]">
                      {coupon.title}
                    </h3>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#6d645a] bg-stone-50 border border-[#e5e1da] px-2.5 py-0.5 rounded">
                      {coupon.code}
                    </span>
                  </div>
                  <p className="text-stone-500 font-sans text-xs sm:text-sm mt-2 leading-relaxed">
                    {coupon.description}
                  </p>
                </div>

                {/* Bottom details or redemption status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-[#e5e1da]/60">
                  {coupon.isRedeemed ? (
                    <div className="flex items-center gap-2 text-rose-700 font-serif text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-semibold block italic">Redeemed Virtually! 🌷</span>
                        <span className="text-[10px] text-stone-400 font-sans">Claimed: {coupon.redeemedAt}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-stone-400 text-xs font-sans font-medium uppercase tracking-wider">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Ready for use</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleRedeemClick(coupon)}
                    disabled={coupon.isRedeemed}
                    className={`px-5 py-2.5 rounded font-sans text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                      coupon.isRedeemed
                        ? 'bg-stone-50 text-stone-300 border border-stone-200 cursor-not-allowed'
                        : 'bg-[#2d2a26] text-white hover:bg-stone-800 cursor-pointer shadow-xs'
                    }`}
                  >
                    {coupon.isRedeemed ? 'Redeemed' : 'Claim Coupon 🎟️'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer controls & transition */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-white border border-[#e5e1da] rounded-lg shadow-sm relative">
        <div className="absolute inset-1 border border-[#e5e1da]/30 rounded pointer-events-none" />
        
        <div className="text-center sm:text-left relative z-10">
          <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-[#2d2a26] flex items-center justify-center sm:justify-start gap-1.5">
            <Ticket className="w-4 h-4 text-[#6d645a]" />
            <span>Virtual Keepsake Box</span>
          </h4>
          <p className="text-[#6d645a] text-xs font-serif italic mt-1">
            Redeemed {totalRedeemed} of {coupons.length} vouchers so far.
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          {totalRedeemed > 0 && (
            <button
              onClick={resetCoupons}
              className="text-xs text-stone-400 hover:text-stone-600 underline font-sans font-medium"
            >
              Reset Vouchers
            </button>
          )}

          <button
            onClick={onNext}
            className="px-8 py-3 bg-[#2d2a26] hover:bg-stone-800 text-white font-sans text-[10px] font-bold tracking-[0.2em] uppercase rounded transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Proceed to the Letter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Redemption Confirmation Modal */}
      <AnimatePresence>
        {showRedeemModal && activeCoupon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRedeemModal(false)}
              className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs"
            />

            {/* Modal content body */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white border border-[#e5e1da] rounded-lg p-8 max-w-md w-full relative z-10 shadow-2xl text-center overflow-hidden"
            >
              <div className="absolute inset-1.5 border border-[#e5e1da]/40 pointer-events-none rounded" />
              <div className="absolute inset-2 border border-[#c8bdae]/20 pointer-events-none rounded" />

              <span className="text-6xl my-4 block filter drop-shadow animate-pulse">
                {activeCoupon.emoji}
              </span>

              <h3 className="text-xl font-serif text-[#2d2a26] font-bold">
                Redeem &ldquo;{activeCoupon.title}&rdquo;?
              </h3>
              
              <p className="text-xs text-[#6d645a] mt-4 leading-relaxed font-serif italic">
                This will digitally lock in your response. Show this coupon to Joshua in real life, or send a screenshot to redeem!
              </p>

              <div className="bg-[#f9f7f2] border border-[#e5e1da] p-4 rounded my-6 text-left">
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#6d645a] block mb-1">
                  Official Stamp Reference:
                </span>
                <span className="font-mono font-bold text-[#2d2a26] text-base uppercase block tracking-widest">
                  {activeCoupon.code}
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="flex-1 py-2.5 border border-[#e5e1da] text-[#6d645a] font-sans text-[10px] font-bold tracking-widest uppercase hover:bg-stone-50 rounded transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRedemption}
                  className="flex-1 py-2.5 bg-[#2d2a26] hover:bg-stone-800 text-white font-sans text-[10px] font-bold tracking-widest uppercase rounded transition-all shadow flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>Yes, Claim!</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
