import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Disc, Wallet, AlertCircle, Clock } from 'lucide-react';
import { motion, useAnimation } from 'motion/react';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';

interface SpinWinProps {
  onBack: () => void;
  balance: number;
  onWin: (amount: number) => void;
}

const SEGMENTS = [0.20, 0.10, 0.50, 0.30, 0.20, 0.15, 0.10, 0.20, 0.30, 0.50];
const DAILY_LIMIT = 5;

export default function SpinWin({ onBack, balance, onWin }: SpinWinProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const controls = useAnimation();
  const rotationRef = useRef(0);

  // Initialize and check daily limit from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('spin_data');
    
    if (savedData) {
      const { date, count } = JSON.parse(savedData);
      if (date === today) {
        setSpinCount(count);
      } else {
        // New day, reset count
        localStorage.setItem('spin_data', JSON.stringify({ date: today, count: 0 }));
        setSpinCount(0);
      }
    } else {
      localStorage.setItem('spin_data', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const handleSpin = async () => {
    if (isSpinning || spinCount >= DAILY_LIMIT) return;
    
    const newCount = spinCount + 1;
    setSpinCount(newCount);
    
    // Persist new count
    const today = new Date().toDateString();
    localStorage.setItem('spin_data', JSON.stringify({ date: today, count: newCount }));

    setIsSpinning(true);
    const winIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentDegrees = 360 / SEGMENTS.length;
    
    // Add 5-10 extra full rotations
    const extraRotations = 5 + Math.floor(Math.random() * 5);
    const totalRotation = extraRotations * 360 + (360 - winIndex * segmentDegrees);
    
    rotationRef.current += totalRotation;

    await controls.start({
      rotate: rotationRef.current,
      transition: { duration: 4, ease: [0.13, 0.99, 0.3, 1] }
    });

    const winAmount = SEGMENTS[winIndex];
    if (winAmount > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#f472b6', '#fac115']
      });
      onWin(winAmount);
    }
    
    setIsSpinning(false);
  };

  const limitReached = spinCount >= DAILY_LIMIT;

  return (
    <div className="min-h-screen p-6 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-12">
        <button onClick={onBack} className="p-2 glass rounded-full text-indigo-400 focus:ring-2 focus:ring-indigo-500 outline-none">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white tracking-tight">Prime Spin</h1>
        <div className="flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-500/30">
          <Wallet size={18} />
          <span className="font-bold tracking-tight">₹{balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Spin Counter */}
        <div className="mb-6 flex items-center gap-2 px-4 py-1.5 glass rounded-full border-white/5">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daily Limit</span>
           <div className="flex gap-1">
             {[...Array(DAILY_LIMIT)].map((_, i) => (
               <div 
                 key={i} 
                 className={cn(
                   "w-2 h-2 rounded-full border border-white/10 transition-all duration-500",
                   i < spinCount ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-white/5"
                 )} 
               />
             ))}
           </div>
           <span className="text-[10px] font-black text-indigo-400 ml-1">{spinCount}/{DAILY_LIMIT}</span>
        </div>

        {/* The Wheel */}
        <div className="relative w-80 h-80 mb-12">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-white">
             <div className="w-8 h-8 clip-triangle bg-indigo-500 rotate-180 shadow-[0_-10px_20px_rgba(99,102,241,0.5)]" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </div>

          <motion.div 
            animate={controls}
            className="w-full h-full rounded-full border-[12px] border-white/5 bg-slate-900 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {SEGMENTS.map((val, i) => {
              const rotate = i * (360 / SEGMENTS.length);
              return (
                <div 
                  key={i}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full flex flex-col items-center pt-8 origin-bottom text-white font-bold"
                  style={{ 
                    transform: `translateX(-50%) rotate(${rotate}deg)`,
                    backgroundColor: i % 2 === 0 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(168, 85, 247, 0.4)',
                    borderLeft: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <span className="text-xl drop-shadow-lg">{val.toFixed(2)}</span>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 mt-1 flex items-center justify-center text-[8px] text-slate-900 font-bold coin-glow">C</div>
                </div>
              );
            })}
            <div className="absolute inset-0 m-auto w-14 h-14 glass rounded-full border-2 border-white/20 z-10 flex items-center justify-center shadow-inner">
               <Disc className={cn("text-white transition-all", isSpinning ? "animate-spin" : "animate-spin-slow")} />
            </div>
          </motion.div>
        </div>

        <div className="text-center mb-8 px-4 max-w-sm">
           {limitReached ? (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col items-center gap-3 p-4 glass rounded-3xl border-rose-500/20"
             >
               <AlertCircle className="text-rose-400" size={32} />
               <div>
                 <h2 className="text-xl font-bold text-white tracking-tight mb-1">Limit Reached</h2>
                 <p className="text-slate-400 text-sm leading-relaxed">
                   You have used your <span className="text-rose-400 font-bold">5 daily spins</span>. Please return tomorrow to test your luck again!
                 </p>
               </div>
             </motion.div>
           ) : (
             <>
               <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Daily Fortune Wheel</h2>
               <p className="text-slate-400 text-sm leading-relaxed">Complete one featured task to unlock your next <span className="text-indigo-400 font-bold">Premium Spin</span>!</p>
             </>
           )}
        </div>

        <motion.button 
          whileHover={!limitReached && !isSpinning ? { scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" } : {}}
          whileTap={!limitReached && !isSpinning ? { scale: 0.95 } : {}}
          disabled={isSpinning || limitReached}
          onClick={handleSpin}
          className={cn(
            "w-full max-w-xs py-4 rounded-2xl font-black uppercase tracking-widest text-white shadow-2xl transition-all border border-white/10",
            (isSpinning || limitReached) 
              ? "bg-slate-800 cursor-not-allowed opacity-50 border-white/5" 
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/20"
          )}
        >
          {isSpinning ? "Scanning..." : limitReached ? "Locked" : "Activate Spin"}
        </motion.button>
        
        <div className="mt-8 glass-card px-4 py-2 rounded-full border-white/5 flex items-center gap-2">
           <Clock className="text-slate-500" size={14} />
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
             {limitReached ? "Resets at 12:00 AM" : "Next Refill: Today"}
           </p>
        </div>
      </div>
    </div>
  );
}
