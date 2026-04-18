import React, { useState, useEffect } from 'react';
import { Play, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, updateDoc, collection, query, getDocs, setDoc, increment, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firebaseErrors';

export const GamePage = () => {
  const [activePlans, setActivePlans] = useState<any[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const today = new Date().toISOString().split('T')[0];
  const taskId = `${auth.currentUser?.uid}_${today}`;

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch purchased plans
    const plansPath = `users/${auth.currentUser.uid}/purchasedPlans`;
    const unsubPlans = onSnapshot(collection(db, 'users', auth.currentUser.uid, 'purchasedPlans'), (snapshot) => {
      setActivePlans(snapshot.docs.map(doc => doc.data()));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, plansPath);
    });

    // Fetch today's task status
    const taskPath = `userTasks/${taskId}`;
    const unsubTask = onSnapshot(doc(db, 'userTasks', taskId), (doc) => {
      if (doc.exists()) {
        setClickCount(doc.data().clickCount || 0);
      } else {
        setClickCount(0);
      }
      setFetching(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, taskPath);
      setFetching(false);
    });

    return () => {
      unsubPlans();
      unsubTask();
    };
  }, [taskId]);

  const handleViewAds = async () => {
    if (!auth.currentUser) return;
    
    // Check if user has any active plans
    if (activePlans.length === 0) {
      showToast('আপনার কোন প্লান একটিভ নেই আগে প্লান কিনুন', 'error');
      return;
    }

    // Check if task already completed today
    if (clickCount >= 1) {
      showToast('আপনার আজকের লিমিট শেষ হয়ে গিয়েছে। আবার কাল চেষ্টা করুন।', 'error');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const taskRef = doc(db, 'userTasks', taskId);

      // Sum up total income from all active plans
      const totalEarning = activePlans.reduce((sum, plan) => sum + Number(plan.dailyIncome || 0), 0);

      try {
        await updateDoc(userRef, {
          balance: increment(totalEarning)
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }

      const taskDoc = await getDoc(taskRef);
      if (taskDoc.exists()) {
        try {
          await updateDoc(taskRef, {
            clickCount: 1,
            lastEarned: totalEarning
          });
        } catch (e) {
          handleFirestoreError(e, OperationType.UPDATE, `userTasks/${taskId}`);
        }
      } else {
        try {
          await setDoc(taskRef, {
            userId: auth.currentUser.uid,
            date: today,
            clickCount: 1,
            lastEarned: totalEarning,
            createdAt: serverTimestamp()
          });
        } catch (e) {
          handleFirestoreError(e, OperationType.CREATE, `userTasks/${taskId}`);
        }
      }

      showToast(`অভিনন্দন! আপনি মোট ${totalEarning} টাকা পেয়েছেন।`, 'success');
      setClickCount(1);
    } catch (error: any) {
      console.error(error);
      const msg = error.message.includes('permission-denied') ? 'আপনার আজকের লিমিট শেষ হয়ে গিয়েছে' : 'সমস্যা হয়েছে, আবার চেষ্টা করুন।';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 pb-24 px-4 bg-white min-h-screen relative transition-colors duration-300">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-24 left-0 right-0 mx-auto z-[100] px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm text-white text-center w-max max-w-[90%] ${
              toast.type === 'success' ? 'bg-[#059669]' : 'bg-red-500'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Task Card */}
      <div className="mt-3 p-5 rounded-[1.5rem] bg-gradient-to-b from-[#1e3a8a] to-[#172554] text-white flex flex-col items-center text-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/10 blur-[60px] pointer-events-none" />
        
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
          <Play size={24} fill="white" className="text-white ml-0.5" />
        </div>

        <h2 className="text-xl font-bold mb-1 tracking-tight">Daily Task</h2>
        <p className="text-white/80 text-xs font-medium mb-4">
          {activePlans.length > 0 
            ? clickCount >= 1 
              ? 'আজকের টাস্ক সম্পন্ন হয়েছে' 
              : `প্রতিদিন আপনার রিওয়ার্ড সংগ্রহ করুন (একটিভ প্ল্যান: ${activePlans.length})` 
            : 'প্যাকেজ কিনলে ইনকাম শুরু হবে'}
        </p>

        <button 
          onClick={handleViewAds}
          disabled={loading || fetching || (activePlans.length > 0 && clickCount >= 1)}
          className="w-full max-w-[180px] py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-xl hover:scale-105 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> processing...</>
          ) : clickCount >= 1 ? (
            'Completed'
          ) : (
            'Collect Reward'
          )}
        </button>
      </div>

      {/* Task Rules Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-colors">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">
            <Clock size={16} />
          </div>
          <h3 className="text-base font-bold text-gray-800">Task Rules (নিয়মাবলী)</h3>
        </div>

        <ul className="space-y-2">
          <li className="flex gap-2">
            <div className="w-1 h-1 rounded-full bg-gray-300 mt-1.5 shrink-0" />
            <p className="text-gray-600 text-xs font-bold leading-relaxed">
              You can complete only 1 task per day.
            </p>
          </li>
          <li className="flex gap-2">
            <div className="w-1 h-1 rounded-full bg-gray-300 mt-1.5 shrink-0" />
            <p className="text-gray-600 text-xs font-bold leading-relaxed">
              Reward depends on your active plan.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};
