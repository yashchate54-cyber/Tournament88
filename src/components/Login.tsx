import React from 'react';
import { motion } from 'motion/react';
import { LogIn, ShieldCheck } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signInWithGoogle();
      onLogin();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="mesh-bg opacity-30" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[40px] p-10 w-full max-w-md border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-10 -mt-10" />
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 mb-6 border border-white/10">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic mb-2">Vault Access</h1>
          <p className="text-slate-500 text-xs font-black tracking-widest uppercase">Secure Personnel Authentication Required</p>
        </div>

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          ) : (
            <>
              <LogIn size={20} className="text-indigo-400 group-hover:scale-110 transition-transform" />
              Authorize with Google
            </>
          )}
        </button>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
            Encrypted session protocols active. <br />
            Unauthorized access is strictly logged.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
