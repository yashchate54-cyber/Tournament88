import React, { useState } from 'react';
import { Gift, Bell, Search, Filter, ArrowUpRight, Play, Gamepad2, Sparkles, Disc, CheckCircle, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OFFERS } from '../constants';
import { cn } from '../lib/utils';
import { Offer } from '../types';

interface HomeProps {
  balance: number;
  userName: string;
  onOpenSpin: () => void;
  onRedeem: () => void;
  onCompleteOffer: (reward: number, taskId: string) => void;
  offers: Offer[];
}

export default function Home({ balance, userName, onOpenSpin, onRedeem, onCompleteOffer, offers }: HomeProps) {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [completing, setCompleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStartOffer = (offer: Offer) => {
    setSelectedOffer(offer);
  };

  const handleConfirmCompletion = () => {
    if (selectedOffer?.link) {
      window.open(selectedOffer.link, '_blank');
    }
    setCompleting(true);
    // Simulate verification
    setTimeout(() => {
      onCompleteOffer(selectedOffer!.reward, selectedOffer!.id);
      setCompleting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedOffer(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div>
          <p className="text-slate-400 text-sm font-medium">Welcome back,</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">{userName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 glass-card rounded-full text-indigo-400 hover:bg-white/10">
            <Bell size={24} />
          </button>
          <button 
            onClick={onRedeem}
            className="flex items-center gap-2 bg-indigo-600/20 text-indigo-300 px-4 py-2 rounded-2xl border border-indigo-500/30 shadow-lg shadow-indigo-500/10 hover:bg-indigo-600/30 transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] text-slate-900 font-bold coin-glow animate-pulse">₹</div>
            <span className="font-bold tracking-tight">₹{balance.toFixed(2)}</span>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="px-6 mt-8 mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-[32px] overflow-hidden aspect-[16/9] glass-card ring-1 ring-white/20 shadow-2xl"
        >
          <img 
            src="https://picsum.photos/seed/cricket/800/450" 
            alt="Hero Banner" 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6">
            <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-1">New Event</p>
            <h2 className="text-white text-xl font-bold leading-tight">Fantasy Cricket returns with ₹10,000 daily rewards!</h2>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-4 px-6 mb-8">
        <QuickAction icon={<Play className="fill-current" />} label="Play & Earn" color="bg-indigo-500/20 text-indigo-400" isNew />
        <QuickAction icon={<Sparkles />} label="Earn More" color="bg-purple-500/20 text-purple-400" isNew />
        <button 
          onClick={onOpenSpin}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 rounded-2xl glass-card text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform relative">
            <Disc size={28} />
          </div>
          <span className="text-[11px] font-bold text-slate-400 text-center leading-tight">Spin & Win</span>
        </button>
        <QuickAction icon={<Gamepad2 />} label="Games" color="bg-teal-500/20 text-teal-400" />
      </div>

      {/* Offers Section */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white tracking-tight">Active Offers</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-full text-slate-300 text-xs font-bold hover:bg-white/10 uppercase tracking-wider">
              <ArrowUpRight size={14} /> Sort
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-full text-slate-300 text-xs font-bold hover:bg-white/10 uppercase tracking-wider">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {offers.map((offer) => (
            <motion.div 
              key={offer.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStartOffer(offer)}
              className="glass-card p-4 rounded-[28px] flex items-center gap-4 hover:border-indigo-500/50 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden glass ring-1 ring-white/10">
                <img 
                  src={offer.icon} 
                  alt={offer.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate">{offer.title}</h3>
                <p className="text-slate-400 text-sm truncate">{offer.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-black text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded-md uppercase tracking-wider">
                    Trending
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 group-hover:bg-indigo-500/10 transition-colors">
                   <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-[8px] text-slate-900 font-bold coin-glow">₹</div>
                   <span className="text-indigo-300 font-bold text-sm tracking-tight">{offer.reward.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Offer Modal */}
      <AnimatePresence>
        {selectedOffer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass rounded-[40px] w-full max-w-sm overflow-hidden border border-white/10"
            >
              <div className="relative p-8">
                <button 
                  onClick={() => setSelectedOffer(null)}
                  className="absolute top-6 right-6 p-2 glass rounded-full text-slate-500 hover:text-white"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden glass ring-4 ring-indigo-500/30 mb-6">
                    <img 
                      src={selectedOffer.icon} 
                      alt={selectedOffer.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <h3 className="text-2xl font-black text-white tracking-tight mb-2">{selectedOffer.title}</h3>
                  <p className="text-slate-400 text-sm mb-8">{selectedOffer.description}</p>

                  <div className="w-full glass rounded-3xl p-6 border-white/5 mb-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Task Instructions</p>
                    <ul className="text-left space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="text-xs text-slate-300">Download and register on the app</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="text-xs text-slate-300">Complete KYC or initial setup</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="text-xs text-slate-300">Reward will be credited instantly</span>
                      </li>
                    </ul>
                  </div>

                  {showSuccess ? (
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full py-4 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center gap-2 border border-emerald-500/30 font-black uppercase tracking-widest"
                    >
                      <CheckCircle size={20} /> Reward Credited!
                    </motion.div>
                  ) : (
                    <button 
                      onClick={handleConfirmCompletion}
                      disabled={completing}
                      className={cn(
                        "w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20",
                        completing 
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                          : "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:scale-105 active:scale-95"
                      )}
                    >
                      {completing ? (
                        <>Verifying... <RefreshCw size={20} className="animate-spin" /></>
                      ) : (
                        <>Start & Earn ₹{selectedOffer.reward.toFixed(2)} <ExternalLink size={18} /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RefreshCw({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function QuickAction({ icon, label, color, isNew }: { icon: React.ReactNode, label: string, color: string, isNew?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center glass-card relative group-hover:scale-110 transition-transform", color)}>
        {icon}
        {isNew && (
          <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#0f172a] shadow-lg shadow-indigo-500/20">
            NEW
          </span>
        )}
      </div>
      <span className="text-[11px] font-bold text-slate-400 text-center leading-tight">{label}</span>
    </div>
  );
}
