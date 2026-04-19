import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { TrendingUp, Lock } from 'lucide-react';
import { auth, db } from './firebase';
import { Page } from './types';

// --- Pages ---
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { MePage } from './pages/MePage';
import { SupportPage } from './pages/SupportPage';
import { UpdatePage } from './pages/UpdatePage';
import { TransactionPage } from './pages/TransactionPage';
import { FAQPage } from './pages/FAQPage';
import { DepositPage } from './pages/DepositPage';
import { WithdrawPage } from './pages/WithdrawPage';
import { GamePage } from './pages/GamePage';
import { SharePage } from './pages/SharePage';
import { AdminApp } from './admin/AdminApp';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<Page>('home');
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [adminPortalPass, setAdminPortalPass] = useState('');
  const [isPortalUnlocked, setIsPortalUnlocked] = useState(false);
  const [globalSettings, setGlobalSettings] = useState<any>(null);

  // Real-time Settings Listener
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'config'), (snapshot) => {
      if (snapshot.exists()) {
        setGlobalSettings(snapshot.data());
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'admin-portal') {
      setIsAdminPortal(true);
    }
  }, []);

  const handlePortalUnlock = () => {
    if (adminPortalPass === 'admin7890') { 
      setIsPortalUnlocked(true);
    } else {
      alert('ভুল পাসওয়ার্ড!');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        setUser({ ...firebaseUser, ...(userDoc.data() || {}) });
      } else {
        setUser(null);
        setIsAdminPortal(false);
        setIsPortalUnlocked(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isAdminPortal) {
    if (!isPortalUnlocked) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-8">
             <div className="text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                   <Lock size={24} className="text-emerald-500" />
                </div>
                <h2 className="text-lg font-black text-white uppercase tracking-widest">Portal Locked</h2>
             </div>
             <div className="space-y-4">
                <input 
                  type="password"
                  placeholder="Password"
                  className="w-full bg-slate-850 border border-slate-800 p-4 rounded-2xl text-center text-white font-black"
                  value={adminPortalPass}
                  onChange={(e) => setAdminPortalPass(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePortalUnlock()}
                />
                <button onClick={handlePortalUnlock} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black">Unlock</button>
             </div>
          </div>
        </div>
      );
    }
    return <AdminApp />;
  }

  if (loading) return null;
  if (!user) return <AuthPage />;

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <HomePage setPage={setActivePage} userName={user.name || 'User'} />;
      case 'me': return <MePage setPage={setActivePage} userName={user.name || 'User'} />;
      case 'deposit': return <DepositPage setPage={setActivePage} />;
      case 'withdraw': return <WithdrawPage setPage={setActivePage} />;
      default: return <HomePage setPage={setActivePage} userName={user.name || 'User'} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header setPage={setActivePage} />
      <main className="max-w-md mx-auto">
        {renderPage()}
      </main>
      <BottomNav activePage={activePage} setPage={setActivePage} />
    </div>
  );
}
