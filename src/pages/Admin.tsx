import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  AlertCircle, 
  Clock, 
  Edit3, 
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Check,
  X,
  Target,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { WithdrawalRequest, Offer } from '../types';
import { db } from '../lib/firebase';
import { collection, getCountFromServer, query, where, getDocs } from 'firebase/firestore';

interface AdminProps {
  currentBalance: number;
  onUpdateBalance: (newBalance: number) => void;
  requests: WithdrawalRequest[];
  onUpdateRequestStatus: (requestId: string, status: 'Completed' | 'Pending' | 'Rejected') => void;
  offers: Offer[];
  onAddTask: (task: Omit<Offer, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function Admin({ 
  currentBalance, 
  onUpdateBalance, 
  requests, 
  onUpdateRequestStatus,
  offers,
  onAddTask,
  onDeleteTask
}: AdminProps) {
  const [balanceInput, setBalanceInput] = useState(currentBalance.toString());
  const [isUpdating, setIsUpdating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [userCount, setUserCount] = useState<number>(0);
  const [totalVolume, setTotalVolume] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      const usersSnap = await getCountFromServer(collection(db, 'users'));
      setUserCount(usersSnap.data().count);

      // Simple calculation for volume (sum of completed withdrawals)
      const completedRequestsQuery = query(collection(db, 'withdrawalRequests'), where('status', '==', 'Completed'));
      const completedSnap = await getDocs(completedRequestsQuery);
      let sum = 0;
      completedSnap.forEach(doc => sum += doc.data().amount);
      setTotalVolume(sum);
    };
    fetchStats();
  }, [requests]);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    reward: '',
    category: 'Finance',
    icon: 'https://picsum.photos/seed/new/100/100',
    link: ''
  });

  const handleBalanceUpdate = () => {
    const val = parseFloat(balanceInput);
    if (!isNaN(val)) {
      setIsUpdating(true);
      setTimeout(() => {
        onUpdateBalance(val);
        setIsUpdating(false);
      }, 500);
    }
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.reward || !newTask.link) return;

    const task: Omit<Offer, 'id'> = {
      title: newTask.title,
      description: newTask.description,
      reward: parseFloat(newTask.reward),
      category: newTask.category,
      icon: newTask.icon,
      link: newTask.link,
      isNew: true
    };

    onAddTask(task);
    setNewTask({
      title: '',
      description: '',
      reward: '',
      category: 'Finance',
      icon: 'https://picsum.photos/seed/new/100/100',
      link: ''
    });
    setShowAddTask(false);
  };

  const stats = [
    { label: "Active Users", value: userCount.toLocaleString(), icon: <Users size={16} />, color: "text-blue-400" },
    { label: "Total Volume", value: `₹${totalVolume.toLocaleString()}`, icon: <TrendingUp size={16} />, color: "text-emerald-400" },
    { label: "Pend. Withdraws", value: requests.filter(r => r.status === 'Pending').length.toString(), icon: <Clock size={16} />, color: "text-amber-400" },
    { label: "Vault Liquidity", value: "Optimal", icon: <Activity size={16} />, color: "text-purple-400" },
  ];

  return (
    <div className="p-6 pb-24 animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Control Center</h1>
          <p className="text-slate-500 text-xs font-black tracking-widest uppercase mt-1">Personnel Authorization Cleared</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
          <AlertCircle size={20} />
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 rounded-3xl border-white/5"
          >
            <div className={cn("p-1.5 rounded-lg bg-white/5 w-fit mb-3", stat.color)}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1">{stat.label}</p>
            <p className="text-lg font-black text-white tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Task Management */}
      <div className="glass rounded-[40px] p-6 mb-8 border-white/10 shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Target size={18} className="text-purple-400" />
            Task Management
          </h2>
          <button 
            onClick={() => setShowAddTask(!showAddTask)}
            className="p-2 glass-card rounded-xl text-indigo-400 hover:text-white transition-colors"
          >
            {showAddTask ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {showAddTask && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <form onSubmit={handleAddTaskSubmit} className="space-y-4 p-4 bg-white/5 rounded-3xl border border-white/5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Task Title</label>
                    <input 
                      type="text" 
                      value={newTask.title}
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                      placeholder="e.g. Kotak 811"
                      className="w-full glass border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Reward (₹)</label>
                    <input 
                      type="number" 
                      value={newTask.reward}
                      onChange={e => setNewTask({...newTask, reward: e.target.value})}
                      placeholder="350"
                      className="w-full glass border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                  <input 
                    type="text" 
                    value={newTask.description}
                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Register and Complete KYC"
                    className="w-full glass border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Task Link</label>
                  <input 
                    type="text" 
                    value={newTask.link}
                    onChange={e => setNewTask({...newTask, link: e.target.value})}
                    placeholder="https://example.com/offer"
                    className="w-full glass border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      value={newTask.category}
                      onChange={e => setNewTask({...newTask, category: e.target.value})}
                      className="w-full glass border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-900 font-bold"
                    >
                      <option>Finance</option>
                      <option>Gaming</option>
                      <option>Shopping</option>
                      <option>Entertainment</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Icon URL</label>
                    <div className="relative">
                      <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="text" 
                        value={newTask.icon}
                        onChange={e => setNewTask({...newTask, icon: e.target.value})}
                        className="w-full glass border border-white/10 rounded-xl py-3 pl-9 pr-4 text-[10px] text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all"
                >
                  Confirm & Deploy Task
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Live Offers</p>
          {offers.map(offer => (
            <div key={offer.id} className="flex items-center gap-3 p-3 glass-card rounded-2xl border-white/5 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden glass">
                <img src={offer.icon} alt={offer.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{offer.title}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase">₹{offer.reward.toFixed(2)}</p>
              </div>
              <button 
                onClick={() => onDeleteTask(offer.id)}
                className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                title="Delete Task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* User Simulation / Balance Control */}
      <div className="glass rounded-[40px] p-6 mb-8 border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-10 -mt-10" />
        
        <h2 className="text-lg font-bold text-white tracking-tight mb-6 flex items-center gap-2">
           <Edit3 size={18} className="text-indigo-400" />
           Balance Override
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Simulate User Balance</label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">₹</div>
              <input 
                type="number"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                className="w-full glass border border-white/10 rounded-2xl py-4 pl-10 pr-5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white font-bold"
              />
            </div>
          </div>

          <button 
            onClick={handleBalanceUpdate}
            disabled={isUpdating}
            className="w-full py-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            {isUpdating ? <RefreshCw className="animate-spin" size={18} /> : "Update Vault Balance"}
          </button>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass rounded-[40px] p-6 border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white tracking-tight">Withdrawal Vault</h2>
          <button className="p-2 glass rounded-xl text-slate-500 hover:text-white transition-colors">
            <Search size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No requests yet</p>
            </div>
          ) : (
            requests.map((req) => (
              <motion.div 
                key={req.id}
                layout
                className={cn(
                  "flex flex-col p-4 glass-card rounded-3xl border-white/5 bg-white/2 cursor-pointer transition-all",
                  expandedId === req.id ? "ring-2 ring-indigo-500/50 bg-indigo-500/5 shadow-inner" : "hover:border-white/10"
                )}
              >
                <div 
                  className="flex items-center justify-between"
                  onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-xs">
                      {req.method.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{req.userName}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{req.id} • {req.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">₹{req.amount.toFixed(2)}</p>
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-[0.1em]",
                      req.status === 'Completed' ? 'text-emerald-400' : 
                      req.status === 'Pending' ? 'text-amber-400' : 
                      req.status === 'Rejected' ? 'text-rose-400' : 'text-indigo-400'
                    )}>{req.status}</p>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === req.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                           <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Payment Channel</p>
                              <p className="text-xs font-bold text-white">{req.method}</p>
                           </div>
                           <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Ticket Status</p>
                              <p className={cn(
                                "text-xs font-bold", 
                                req.status === 'Completed' ? 'text-emerald-400' : 
                                req.status === 'Rejected' ? 'text-rose-400' : 'text-amber-400'
                              )}>{req.status}</p>
                           </div>
                        </div>

                        <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Credential Data</p>
                          <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 shadow-inner">
                            <span className="text-sm font-mono text-indigo-300 break-all tracking-tight leading-relaxed">{req.details}</span>
                          </div>
                        </div>

                        {req.status === 'Pending' && (
                          <div className="flex gap-2 pt-2">
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 onUpdateRequestStatus(req.id, 'Completed');
                               }}
                               className="flex-1 py-3 bg-emerald-500/10 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                             >
                               <Check size={14} /> Approve
                             </button>
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 onUpdateRequestStatus(req.id, 'Rejected');
                               }}
                               className="flex-1 py-3 bg-rose-500/10 text-rose-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2"
                             >
                               <X size={14} /> Decline
                             </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>

        <button className="w-full mt-6 py-3 border border-dashed border-white/10 rounded-2xl text-slate-500 text-[10px] font-black uppercase tracking-widest hover:border-white/20 hover:text-slate-400 transition-all">
          Generate Full Auditor Report
        </button>
      </div>

      <div className="mt-8 text-center px-10">
        <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed">
          Critical Operations Logged. System integrity check: <span className="text-emerald-500/50">Optimal</span>
        </p>
      </div>
    </div>
  );
}
