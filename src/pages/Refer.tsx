import React, { useState } from 'react';
import { ChevronLeft, Instagram, Send, Facebook, Share2, Users, CheckCircle, TrendingUp, BarChart, PlusCircle, X, ExternalLink } from 'lucide-react';
import { REFERRALS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Offer } from '../types';

interface ReferProps {
  onBack: () => void;
  offers: Offer[];
}

export default function Refer({ onBack, offers }: ReferProps) {
  const referralCode = "NYZIYE";
  const [earnings] = useState(6594.43);
  const [selectedTask, setSelectedTask] = useState<Offer | null>(null);
  const [showTaskPicker, setShowTaskPicker] = useState(false);

  // Simple stats calculation
  const totalReferrals = REFERRALS.length;
  const totalCompleted = REFERRALS.reduce((acc, curr) => acc + curr.offersCompleted, 0);
  const conversionRate = totalReferrals > 0 ? ((totalCompleted / (totalReferrals * 3)) * 100).toFixed(1) : 0;

  const getShareLink = () => {
    const baseLink = `https://spinwin.app/refer/${referralCode}`;
    return selectedTask ? `${baseLink}?task=${selectedTask.id}` : baseLink;
  };

  const handleShare = () => {
    const link = getShareLink();
    if (navigator.share) {
      navigator.share({
        title: 'Join SpinWin',
        text: `Hey! Join SpinWin using my code ${referralCode} and complete the ${selectedTask ? selectedTask.title : 'Discovery'} task to earn!`,
        url: link,
      });
    } else {
      navigator.clipboard.writeText(link);
      alert('Referral Link Copied!');
    }
  };

  return (
    <div className="min-h-screen p-6 pb-24 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 glass rounded-full text-indigo-400">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-white tracking-tight">Refer & Earn</h1>
        </div>
      </div>

      <div className="glass rounded-[40px] p-8 mb-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 group-hover:opacity-100 opacity-50 transition-opacity" />
        
        {/* Task Promotion Section */}
        <div className="relative z-10 mb-6">
           <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-4">Promoted Task for Link</p>
           <button 
             onClick={() => setShowTaskPicker(true)}
             className="w-full glass-card p-3 rounded-2xl border-white/10 flex items-center gap-3 hover:border-indigo-500/50 transition-all group/task"
           >
             {selectedTask ? (
               <>
                 <div className="w-10 h-10 rounded-xl overflow-hidden glass border border-white/10">
                   <img src={selectedTask.icon} alt="" className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1 text-left">
                   <p className="text-xs font-black text-white truncate">{selectedTask.title}</p>
                   <p className="text-[10px] text-indigo-400 font-bold">Earn ₹{selectedTask.reward.toFixed(2)} on Completion</p>
                 </div>
                 <PlusCircle size={20} className="text-slate-500 group-hover/task:text-indigo-400" />
               </>
             ) : (
               <>
                 <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-white/5">
                   <PlusCircle size={24} />
                 </div>
                 <div className="flex-1 text-left">
                   <p className="text-xs font-black text-white">Add specific task to link</p>
                   <p className="text-[10px] text-slate-500 font-bold italic">Increase conversion by 40%</p>
                 </div>
                 <ChevronLeft size={16} className="text-slate-500 rotate-180" />
               </>
             )}
           </button>
        </div>

        <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-4 relative z-10">Your Referral Code</p>
        <div className="flex justify-center mb-6 relative z-10">
           <div className="glass-card px-10 py-3 rounded-2xl text-2xl font-black text-white tracking-[0.2em] border-white/20 shadow-xl">
              {referralCode}
           </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-8 relative z-10">
          <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] text-slate-900 font-bold coin-glow">₹</div>
          <span className="text-2xl font-black text-indigo-300 tracking-tight">{earnings.toLocaleString()}</span>
          <span className="text-sm text-slate-400 font-bold">Earned</span>
        </div>

        <div className="flex justify-center gap-4 relative z-10">
          <SocialIcon onClick={handleShare} color="bg-pink-500/10 text-pink-400 border-pink-500/20" icon={<Instagram size={20} />} />
          <SocialIcon onClick={handleShare} color="bg-sky-500/10 text-sky-400 border-sky-500/20" icon={<Send size={20} />} />
          <SocialIcon onClick={handleShare} color="bg-blue-500/10 text-blue-400 border-blue-500/20" icon={<Facebook size={20} />} />
          <SocialIcon onClick={() => {
            navigator.clipboard.writeText(getShareLink());
            alert('Referral Link Copied!');
          }} color="bg-orange-500/10 text-orange-400 border-orange-500/20" icon={<Share2 size={20} />} />
        </div>
      </div>

      {/* Rewards Analytics Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white tracking-tight mb-4 px-2">Rewards Analytics</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            icon={<Users size={20} />} 
            label="Total Referrals" 
            value={totalReferrals.toString()} 
            subValue="+12% this week" 
            color="text-indigo-400"
          />
          <StatCard 
            icon={<CheckCircle size={20} />} 
            label="Offers Completed" 
            value={totalCompleted.toString()} 
            subValue="Target: 50" 
            color="text-emerald-400"
          />
          <StatCard 
            icon={<TrendingUp size={20} />} 
            label="Conversion" 
            value={`${conversionRate}%`} 
            subValue="Average rate" 
            color="text-purple-400"
          />
          <StatCard 
            icon={<BarChart size={20} />} 
            label="Month Earnings" 
            value="₹1,240" 
            subValue="Est. Payout" 
            color="text-amber-400"
          />
        </div>
      </div>

      <div className="glass rounded-[40px] p-8 border-white/10 shadow-2xl">
        <h2 className="text-lg font-bold text-white tracking-tight mb-2">Network Status</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
           Milestones completed by your referrals unlock higher tiers of your <span className="text-indigo-400 font-bold tracking-tight">Income Potential</span>.
        </p>

        <div className="space-y-4">
          {REFERRALS.map((ref) => (
            <motion.div 
              key={ref.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 p-4 rounded-[24px] flex items-center gap-4 border border-white/5 hover:border-indigo-500/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                {ref.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-white truncate mr-2">{ref.name}</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-indigo-400 font-bold text-sm">0</span>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                  <p className="text-slate-500">{ref.offersCompleted}/{ref.totalOffers} Completed</p>
                  <p className="text-indigo-400/60">Potential</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Task Picker Modal */}
      <AnimatePresence>
        {showTaskPicker && (
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
              className="glass rounded-[40px] w-full max-w-sm overflow-hidden border border-white/10 max-h-[80vh] flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                 <h3 className="text-lg font-black text-white tracking-tight uppercase">Select Promo Task</h3>
                 <button onClick={() => setShowTaskPicker(false)} className="p-2 glass rounded-full text-slate-500 hover:text-white">
                   <X size={20} />
                 </button>
              </div>

              <div className="p-4 space-y-3 overflow-y-auto flex-1 no-scrollbar">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">High Conversion Offers</p>
                {offers.map((offer) => (
                  <button 
                    key={offer.id}
                    onClick={() => {
                      setSelectedTask(offer);
                      setShowTaskPicker(false);
                    }}
                    className={cn(
                      "w-full glass-card p-3 rounded-2xl flex items-center gap-3 border transition-all text-left group",
                      selectedTask?.id === offer.id ? "border-indigo-500 bg-indigo-500/5" : "border-white/5 hover:border-white/20"
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden glass">
                       <img src={offer.icon} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-sm font-bold text-white truncate">{offer.title}</h4>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Reward: ₹{offer.reward.toFixed(2)}</p>
                    </div>
                    {selectedTask?.id === offer.id && <CheckCircle size={18} className="text-indigo-400 shrink-0" />}
                  </button>
                ))}
              </div>

              <div className="p-6 bg-white/5 border-t border-white/5">
                 <button 
                   onClick={() => {
                     setSelectedTask(null);
                     setShowTaskPicker(false);
                   }}
                   className="w-full py-3 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-slate-300 transition-colors"
                 >
                   Clear Task Selection
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, color }: { icon: React.ReactNode, label: string, value: string, subValue: string, color: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 rounded-3xl border-white/5"
    >
      <div className={cn("p-2 bg-white/5 w-fit rounded-xl mb-4", color)}>
        {icon}
      </div>
      <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">{label}</p>
      <p className="text-xl font-black text-white tracking-tight mb-1">{value}</p>
      <p className="text-[10px] text-slate-400 font-medium">{subValue}</p>
    </motion.div>
  );
}

function SocialIcon({ color, icon, onClick }: { color: string, icon: React.ReactNode, onClickText?: string, onClick?: () => void }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.1, translateY: -4 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${color} glass transition-all shadow-lg`}
    >
      {icon}
    </motion.button>
  );
}
