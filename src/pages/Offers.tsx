import React, { useState } from 'react';
import { Search, ArrowUpRight, Filter, CheckCircle, ExternalLink, X, RefreshCw } from 'lucide-react';
import { OFFERS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Offer } from '../types';
import { cn } from '../lib/utils';

interface OffersProps {
  onCompleteOffer: (reward: number, taskId: string) => void;
  offers: Offer[];
}

export default function Offers({ onCompleteOffer, offers }: OffersProps) {
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
    <div className="p-6 pb-24 animate-in slide-in-from-right duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-4">Discovery</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search offers..." 
            className="w-full glass border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {['All', 'Finance', 'Shopping', 'Gaming', 'Food'].map((cat) => (
          <button 
            key={cat}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              cat === 'All' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'glass text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
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
