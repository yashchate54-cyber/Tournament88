import React, { useState } from 'react';
import { ChevronRight, Wallet, ArrowLeft, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { REDEEM_OPTIONS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { RedeemOption, WithdrawalRequest } from '../types';
import { cn } from '../lib/utils';

interface RedeemProps {
  balance: number;
  onWithdraw: (request: Omit<WithdrawalRequest, 'id' | 'status' | 'timestamp' | 'userName'>) => void;
  requests?: WithdrawalRequest[];
}

type Step = 'list' | 'form' | 'processing' | 'success';

export default function Redeem({ balance, onWithdraw, requests = [] }: RedeemProps) {
  const [activeStep, setActiveStep] = useState<Step>('list');
  const [selectedOption, setSelectedOption] = useState<RedeemOption | null>(null);
  
  // Form fields
  const [upiId, setUpiId] = useState('');
  const [bankAccNumber, setBankAccNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [genericDetail, setGenericDetail] = useState(''); // For mobile, etc.
  
  const [amount, setAmount] = useState('100');
  const [error, setError] = useState('');

  const minAmount = 100;

  const handleSelectOption = (option: RedeemOption) => {
    setSelectedOption(option);
    setActiveStep('form');
    setError('');
  };

  const handleRedeemRequest = () => {
    const numAmount = parseFloat(amount);
    
    let detailsStr = '';
    if (selectedOption?.id === 'upi') {
      if (!upiId) { setError('Please enter UPI ID'); return; }
      detailsStr = upiId;
    } else if (selectedOption?.id === 'bank') {
      if (!bankAccNumber || !bankIfsc) { setError('Please enter Bank Account number & IFSC'); return; }
      detailsStr = `ACC: ${bankAccNumber} | IFSC: ${bankIfsc}`;
    } else {
      if (!genericDetail) { setError('Please enter details'); return; }
      detailsStr = genericDetail;
    }

    if (isNaN(numAmount) || numAmount < minAmount) {
      setError(`Minimum withdrawal is ₹${minAmount}`);
      return;
    }
    if (numAmount > balance) {
      setError('Insufficient balance');
      return;
    }

    setActiveStep('processing');
    
    // Simulate API call
    setTimeout(() => {
      onWithdraw({
        amount: numAmount,
        method: selectedOption?.title || 'Unknown',
        details: detailsStr
      });
      setActiveStep('success');
    }, 2000);
  };

  const reset = () => {
    setActiveStep('list');
    setSelectedOption(null);
    setUpiId('');
    setBankAccNumber('');
    setBankIfsc('');
    setGenericDetail('');
    setAmount('100');
    setError('');
  };

  return (
    <div className="p-6 pb-24 animate-in slide-in-from-right duration-300 min-h-screen">
      <AnimatePresence mode="wait">
        {activeStep === 'list' && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Withdraw</h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Redeem your earnings</p>
              </div>
              <div className="flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-2xl border border-indigo-500/30">
                <Wallet size={18} />
                <span className="font-black tracking-tight">₹{balance.toFixed(2)}</span>
              </div>
            </div>

            <div className="glass rounded-[40px] p-6 border-white/10 shadow-2xl">
              <h2 className="text-lg font-bold text-white tracking-tight mb-6 flex items-center gap-2">
                 <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                 Available Options
              </h2>

              <div className="space-y-4">
                {REDEEM_OPTIONS.map((option) => (
                  <motion.div 
                    key={option.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectOption(option)}
                    className="glass-card p-4 rounded-[28px] flex items-center gap-4 hover:border-indigo-500/50 group cursor-pointer border-white/5"
                  >
                    <div className="w-14 h-14 rounded-2xl overflow-hidden glass p-2 flex items-center justify-center ring-1 ring-white/10 group-hover:scale-105 transition-transform">
                      <img 
                        src={option.icon} 
                        alt={option.title} 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate text-sm">{option.title}</h3>
                      <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-0.5">{option.description}</p>
                    </div>
                    <div className="p-2 glass rounded-xl text-slate-500 group-hover:text-indigo-400 transition-colors">
                      <ChevronRight size={18} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed px-8">
                  Minimum withdrawal amount is <span className="text-indigo-400">₹100.00</span>. 
                  Processing time: 24-48 hours.
               </p>
            </div>

            {requests.length > 0 && (
              <div className="mt-12">
                <h2 className="text-lg font-bold text-white tracking-tight mb-6 flex items-center gap-2">
                   <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                   Transaction History
                </h2>
                <div className="space-y-3">
                  {requests.map((req) => (
                    <div 
                      key={req.id} 
                      className="glass-card p-4 rounded-[24px] border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          req.status === 'Completed' ? "bg-emerald-500/10 text-emerald-500" :
                          req.status === 'Rejected' ? "bg-rose-500/10 text-rose-500" :
                          req.status === 'Processing' ? "bg-blue-500/10 text-blue-500" :
                          "bg-amber-500/10 text-amber-500"
                        )}>
                          <Wallet size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">₹{req.amount.toFixed(2)}</h4>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{req.method}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                          req.status === 'Completed' ? "bg-emerald-500/20 text-emerald-400" :
                          req.status === 'Rejected' ? "bg-rose-500/20 text-rose-400" :
                          req.status === 'Processing' ? "bg-blue-500/20 text-blue-400" :
                          "bg-amber-500/20 text-amber-400"
                        )}>
                          {req.status}
                        </span>
                        <p className="text-[9px] text-slate-600 mt-1 font-medium">
                          {new Date(req.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeStep === 'form' && selectedOption && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <button onClick={reset} className="p-2 glass rounded-full text-indigo-400">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-bold text-white tracking-tight">{selectedOption.title} Withdrawal</h1>
            </div>

            <div className="glass rounded-[40px] p-8 border-white/10 shadow-2xl relative overflow-hidden">
               <div className="w-20 h-20 rounded-3xl glass p-4 mb-6 ring-2 ring-indigo-500/50">
                  <img src={selectedOption.icon} alt={selectedOption.title} className="w-full h-full object-contain" />
               </div>

               <div className="space-y-6">
                 {selectedOption.id === 'upi' ? (
                   <div>
                     <label className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2 px-1">UPI ID</label>
                     <input 
                       type="text"
                       value={upiId}
                       onChange={(e) => setUpiId(e.target.value)}
                       placeholder="yourname@upi"
                       className="w-full glass border border-white/10 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-slate-600"
                     />
                   </div>
                 ) : selectedOption.id === 'bank' ? (
                   <>
                     <div>
                       <label className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2 px-1">Account Number</label>
                       <input 
                         type="text"
                         value={bankAccNumber}
                         onChange={(e) => setBankAccNumber(e.target.value)}
                         placeholder="Enter account number"
                         className="w-full glass border border-white/10 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-slate-600"
                       />
                     </div>
                     <div>
                       <label className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2 px-1">IFSC Code</label>
                       <input 
                         type="text"
                         value={bankIfsc}
                         onChange={(e) => setBankIfsc(e.target.value)}
                         placeholder="SBIN0001234"
                         className="w-full glass border border-white/10 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-slate-600 uppercase"
                       />
                     </div>
                   </>
                 ) : (
                   <div>
                     <label className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2 px-1">
                       {selectedOption.id === 'mobile' ? 'Mobile Number' : 'Details'}
                     </label>
                     <input 
                       type="text"
                       value={genericDetail}
                       onChange={(e) => setGenericDetail(e.target.value)}
                       placeholder="Enter details"
                       className="w-full glass border border-white/10 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-slate-600"
                     />
                   </div>
                 )}

                 <div>
                   <label className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2 px-1">Amount (Coins)</label>
                   <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">₹</div>
                      <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="100"
                        className="w-full glass border border-white/10 rounded-2xl py-4 pl-10 pr-5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder:text-slate-600"
                      />
                   </div>
                   <div className="flex justify-between items-center mt-2 px-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Available: ₹{balance.toFixed(2)}</span>
                      <button 
                        onClick={() => setAmount(balance.toFixed(0))}
                        className="text-[10px] text-indigo-400 font-black uppercase tracking-widest hover:text-indigo-300 transition-colors"
                      >
                        Max Out
                      </button>
                   </div>
                 </div>

                 {error && (
                   <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 animate-in fade-in zoom-in duration-200">
                     <AlertCircle size={16} />
                     <span className="text-xs font-bold uppercase tracking-wide">{error}</span>
                   </div>
                 )}

                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={handleRedeemRequest}
                   className="w-full py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 mt-4 flex items-center justify-center gap-2 group"
                 >
                   Confirm Request <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </motion.button>
               </div>
            </div>
          </motion.div>
        )}

        {activeStep === 'processing' && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center min-h-[70vh] text-center"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 animate-spin border-t-indigo-500" />
              <Loader2 className="absolute inset-0 m-auto text-indigo-500 animate-pulse" size={32} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mt-8 mb-2">Authenticating</h2>
            <p className="text-slate-400 text-sm font-medium">Verifying your coin balance and payment secure channel...</p>
          </motion.div>
        )}

        {activeStep === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center border-4 border-emerald-500/30 shadow-2xl shadow-emerald-500/20 mb-8">
              <CheckCircle className="text-emerald-500" size={48} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">Success!</h2>
            <p className="text-slate-400 text-base font-medium leading-relaxed mb-10">
              Your withdrawal request of <span className="text-indigo-400 font-black tracking-tight">₹{parseFloat(amount).toFixed(2)}</span> has been placed. 
              The coins have been deducted from your vault.
            </p>
            <button 
              onClick={reset}
              className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-white/10 hover:border-indigo-500/50 transition-all shadow-xl"
            >
              Back to Terminal
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
