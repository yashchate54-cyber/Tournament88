import React, { useState, useEffect } from 'react';
import { Tab, WithdrawalRequest, Offer } from './types';
import Home from './pages/Home';
import Refer from './pages/Refer';
import Offers from './pages/Offers';
import SpinWin from './pages/SpinWin';
import Redeem from './pages/Redeem';
import Admin from './pages/Admin';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import { User as UserIcon, Shield, Info, LogOut, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, 
  db, 
  handleFirestoreError, 
  OperationType 
} from './lib/firebase';
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  signOut
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  collection, 
  query, 
  where,
  orderBy,
  updateDoc,
  serverTimestamp,
  addDoc,
  deleteDoc,
  increment,
  arrayUnion
} from 'firebase/firestore';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [balance, setBalance] = useState(0);
  const [showSpinWin, setShowSpinWin] = useState(false);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.email === 'yashchate63@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    // User Data Sync
    const userRef = doc(db, 'users', user.uid);
    const unsubUser = onSnapshot(userRef, async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setBalance(data.balance || 0);
      } else {
        // Create user profile if doesn't exist
        const newUserData = {
          uid: user.uid,
          displayName: user.displayName || 'User',
          email: user.email || '',
          balance: 0,
          referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          completedTasks: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        try {
          await setDoc(userRef, newUserData);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
        }
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });

    // Tasks Sync (Public)
    const tasksRef = collection(db, 'tasks');
    const unsubTasks = onSnapshot(query(tasksRef, orderBy('createdAt', 'desc')), (snap) => {
      const taskList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
      setOffers(taskList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tasks');
    });

    // Withdrawal Requests Sync
    const requestsRef = collection(db, 'withdrawalRequests');
    // Admin sees all, user sees own
    const q = isAdmin 
      ? query(requestsRef, orderBy('timestamp', 'desc'))
      : query(requestsRef, where('userId', '==', user.uid), orderBy('timestamp', 'desc'));

    const unsubRequests = onSnapshot(q, (snap) => {
      const requestList = snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        timestamp: doc.data().timestamp?.toMillis() || Date.now()
      } as WithdrawalRequest));
      setWithdrawalRequests(requestList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'withdrawalRequests');
    });

    return () => {
      unsubUser();
      unsubTasks();
      unsubRequests();
    };
  }, [user, isAdmin]);

  const handleWin = async (amount: number) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, {
        balance: increment(amount),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleRedeem = async (requestData: Omit<WithdrawalRequest, 'id' | 'status' | 'timestamp' | 'userName'>) => {
    if (!user) return;
    
    try {
      // 1. Deduct balance
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        balance: increment(-requestData.amount),
        updatedAt: serverTimestamp()
      });

      // 2. Create request
      await addDoc(collection(db, 'withdrawalRequests'), {
        ...requestData,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        status: 'Pending',
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'withdrawalRequests');
    }
  };

  const handleCompleteOffer = async (reward: number, taskId: string) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    
    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;
      
      const completedTasks = snap.data().completedTasks || [];
      if (completedTasks.includes(taskId)) return; // Already completed

      await updateDoc(userRef, {
        balance: increment(reward),
        completedTasks: arrayUnion(taskId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleUpdateRequestStatus = async (requestId: string, status: 'Completed' | 'Pending' | 'Rejected') => {
    if (!isAdmin) return;
    const reqRef = doc(db, 'withdrawalRequests', requestId);
    try {
      await updateDoc(reqRef, { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `withdrawalRequests/${requestId}`);
    }
  };

  const handleAddTask = async (task: Omit<Offer, 'id'>) => {
    if (!isAdmin) return;
    try {
      await addDoc(collection(db, 'tasks'), {
        ...task,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'tasks');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tasks/${taskId}`);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'Home':
        return <Home 
          balance={balance} 
          userName={user?.displayName || 'User'}
          onOpenSpin={() => setShowSpinWin(true)} 
          onRedeem={() => setActiveTab('Redeem')}
          onCompleteOffer={handleCompleteOffer}
          offers={offers}
        />;
      case 'Offers':
        return <Offers onCompleteOffer={handleCompleteOffer} offers={offers} />;
      case 'Refer':
        return <Refer onBack={() => setActiveTab('Home')} offers={offers} />;
      case 'Redeem':
        return <Redeem balance={balance} onWithdraw={handleRedeem} requests={withdrawalRequests} />;
      case 'Admin':
        return isAdmin ? (
          <Admin 
            currentBalance={balance} 
            onUpdateBalance={async (val) => {
              const userRef = doc(db, 'users', user.uid);
              await updateDoc(userRef, { balance: val, updatedAt: serverTimestamp() });
            }} 
            requests={withdrawalRequests}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            offers={offers}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <div className="flex items-center justify-center h-screen">Access Denied</div>
        );
      case 'Settings':
        return <SettingsPage onLogout={handleLogout} user={user} />;
      default:
        return <Home 
          balance={balance} 
          userName={user?.displayName || 'User'}
          onOpenSpin={() => setShowSpinWin(true)} 
          onRedeem={() => setActiveTab('Redeem')}
          onCompleteOffer={handleCompleteOffer}
          offers={offers}
        />;
    }
  };

  return (
    <div className="min-h-screen text-slate-200 selection:bg-indigo-500/30">
      <div className="mesh-bg" />
      <AnimatePresence mode="wait">
        {showSpinWin ? (
           <SpinWin 
             onBack={() => setShowSpinWin(false)} 
             balance={balance}
             onWin={handleWin}
           />
        ) : (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderTab()}
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsPage({ onLogout, user }: { onLogout: () => void, user: FirebaseUser }) {
  return (
    <div className="p-6 pb-24 animate-in slide-in-from-right duration-300">
      <h1 className="text-2xl font-bold text-white tracking-tight mb-8">Management</h1>
      
      <div className="glass rounded-[40px] p-6 border-white/10 shadow-2xl mb-6">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-white/5 overflow-hidden">
            {user.photoURL ? <img src={user.photoURL} alt="" /> : user.displayName?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{user.displayName || 'User'}</h2>
            <p className="text-slate-400 text-sm font-mono">{user.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <SettingsItem icon={<UserIcon size={20} />} label="Security Protocol" />
          <SettingsItem icon={<Shield size={20} />} label="Vault Encryption" />
          <SettingsItem icon={<Info size={20} />} label="Service Status" />
          <SettingsItem icon={<LogOut size={20} />} label="Deactivate Session" color="text-rose-400" onClick={onLogout} />
        </div>
      </div>

      <div className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
        App Framework v5.4.2 (Secure Build)
      </div>
    </div>
  );
}

function SettingsItem({ icon, label, color = "text-slate-300", onClick }: { icon: React.ReactNode, label: string, color?: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-3 glass-card rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group mb-2 border-white/5"
    >
      <div className={`flex items-center gap-4 ${color}`}>
        <div className="p-2 bg-white/5 rounded-xl group-hover:text-white transition-colors">
           {icon}
        </div>
        <span className="font-bold text-sm">{label}</span>
      </div>
      <ChevronRight className="text-slate-600 group-hover:text-slate-200 transition-colors" size={20} />
    </div>
  );
}

