import { Home, Tag, Users, Wallet, Settings, ShieldCheck } from 'lucide-react';
import { Tab } from '../types';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isAdmin?: boolean;
}

export default function BottomNav({ activeTab, setActiveTab, isAdmin }: BottomNavProps) {
  const tabs = [
    { id: 'Home', icon: Home, label: 'Home' },
    { id: 'Offers', icon: Tag, label: 'Discovery' },
    { id: 'Refer', icon: Users, label: 'Network' },
    { id: 'Redeem', icon: Wallet, label: 'Withdraw' },
    ...(isAdmin ? [{ id: 'Admin', icon: ShieldCheck, label: 'Control' }] : []),
    { id: 'Settings', icon: Settings, label: 'Account' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-6 py-2 pb-6 flex justify-between items-center z-50">
      {tabs.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id as Tab)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all duration-300",
            activeTab === id ? "text-indigo-400" : "text-slate-500"
          )}
        >
          <div className={cn(
            "p-2 rounded-2xl transition-all duration-500",
            activeTab === id ? "bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]" : "bg-transparent hover:bg-white/5"
          )}>
            <Icon size={22} strokeWidth={activeTab === id ? 2.5 : 1.5} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </button>
      ))}
    </div>
  );
}
