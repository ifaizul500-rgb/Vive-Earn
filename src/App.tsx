import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getDocFromCache, getDocFromServer, enableNetwork } from 'firebase/firestore';
import { TrendingUp } from 'lucide-react';
import { auth, db } from './firebase';

// --- Types ---
import { Page } from './types';

// --- Components ---
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';

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
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [activePage, setActivePage] = useState<Page>('home');

  const attemptSync = async (firebaseUser: any) => {
    try {
      // First try to get from server with a timeout or specific check
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        setUser({ ...firebaseUser, ...userDoc.data() });
        setIsOffline(false);
      } else {
        // New user or not found on server
        setUser({ 
          ...firebaseUser, 
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          role: 'user' 
        });
        setIsOffline(false);
      }
    } catch (err: any) {
      // If the error is network related
      if (err.code === 'unavailable' || err.message.includes('offline')) {
        console.warn("Server unreachable, trying cache...");
        setIsOffline(true);
        try {
          const cachedDoc = await getDocFromCache(doc(db, 'users', firebaseUser.uid));
          if (cachedDoc.exists()) {
            setUser({ ...firebaseUser, ...cachedDoc.data() });
          }
        } catch (cacheErr) {
          console.log("No cached data found for this user.");
        }
      } else {
        console.error("Firestore sync error:", err);
      }
    }
  };

  const handleRetryConnection = async () => {
    setLoading(true);
    try {
      await enableNetwork(db);
      if (auth.currentUser) {
        await attemptSync(auth.currentUser);
      }
      await getDocFromServer(doc(db, 'test', 'connection'));
      setIsOffline(false);
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Safety timeout
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 8000); 

    // Initial connection test
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('Backend didn\'t respond'))) {
          console.error("Please check your Firebase configuration or internet connection.");
          setIsOffline(true);
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          if (!user) {
            setUser({ 
              uid: firebaseUser.uid, 
              name: firebaseUser.displayName || 'User',
              role: 'user' 
            });
          }
          await attemptSync(firebaseUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth listener error:", err);
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center transition-colors duration-300">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="w-20 h-20 rounded-3xl bg-[#059669] flex items-center justify-center text-white shadow-2xl shadow-[#059669]/30 mb-6"
        >
          <TrendingUp size={40} />
        </motion.div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-full bg-[#059669]"
            />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Loading Vive Earn</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const getUserName = () => {
    return user.name || user.displayName || user.email?.split('@')[0] || 'User';
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <HomePage setPage={setActivePage} userName={getUserName()} />;
      case 'products': return <ProductsPage />;
      case 'game': return <GamePage />;
      case 'share': return <SharePage />;
      case 'me': return <MePage setPage={setActivePage} userName={getUserName()} />;
      case 'deposit': return <DepositPage setPage={setActivePage} />;
      case 'withdraw': return <WithdrawPage setPage={setActivePage} />;
      case 'support': return <SupportPage setPage={setActivePage} />;
      case 'update': return <UpdatePage />;
      case 'transaction': return <TransactionPage />;
      case 'faq': return <FAQPage />;
      case 'admin': 
        if (user.role === 'admin' || user.email === 'ifaizul500@gmail.com') {
          return <AdminPage setPage={setActivePage} />;
        }
        return <HomePage setPage={setActivePage} userName={getUserName()} />;
      default: return <HomePage setPage={setActivePage} userName={getUserName()} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 transition-colors duration-300">
      {isOffline && (
        <div className="bg-amber-500 text-white text-[10px] font-bold py-1 px-4 text-center flex items-center justify-center gap-2">
          <span>ইন্টারনেট সংযোগে সমস্যা হচ্ছে (Offline)</span>
          <button 
            onClick={handleRetryConnection}
            className="bg-white text-amber-600 px-2 py-0.5 rounded-md hover:bg-amber-50"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}
      <Header setPage={setActivePage} />
      
      <main className="max-w-md mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activePage={activePage} setPage={setActivePage} />
    </div>
  );
}
