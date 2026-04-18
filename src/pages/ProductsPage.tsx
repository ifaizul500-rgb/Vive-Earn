import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, updateDoc, setDoc, collection, onSnapshot, serverTimestamp, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firebaseErrors';

export const ProductsPage = () => {
  const [planType, setPlanType] = useState<'regular' | 'premium'>('regular');
  const [userBalance, setUserBalance] = useState(0);
  const [purchasedPlans, setPurchasedPlans] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    // Listen to user balance
    const userPath = `users/${auth.currentUser.uid}`;
    const unsubUser = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserBalance(Number(data.balance || 0));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, userPath);
    });

    // Listen to purchased plans
    const plansPath = `users/${auth.currentUser.uid}/purchasedPlans`;
    const unsubPlans = onSnapshot(collection(db, 'users', auth.currentUser.uid, 'purchasedPlans'), (snapshot) => {
      const ids = snapshot.docs.map(doc => doc.data().planId);
      setPurchasedPlans(ids);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, plansPath);
    });

    return () => {
      unsubUser();
      unsubPlans();
    };
  }, []);


  const handleBuy = async (plan: any) => {
    console.log("Attempting to buy plan:", plan.name, "Balance:", userBalance);
    if (!auth.currentUser) return;
    
    // Check balance explicitly
    const price = Number(plan.price);
    const balance = Number(userBalance);

    if (balance === 0 || balance < price) {
      console.log("Insufficient balance check triggered");
      showToast('আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই আগে ডিপোজিট করুন।', 'error');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const planRef = doc(db, 'users', auth.currentUser.uid, 'purchasedPlans', plan.id.toString());

      // Decrement balance
      try {
        await updateDoc(userRef, {
          balance: increment(-price)
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }

      // Add plan
      try {
        await setDoc(planRef, {
          planId: plan.id.toString(),
          planName: plan.name,
          dailyIncome: Number(String(plan.daily).replace(/[^0-9.]/g, '')),
          purchaseDate: serverTimestamp()
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${auth.currentUser.uid}/purchasedPlans/${plan.id}`);
      }

      console.log("Purchase successful");
      showToast('আপনার প্যাকেজটি সফলভাবে চালু হয়েছে।', 'success');
    } catch (error: any) {
      console.error("Purchase Error:", error);
      if (error.message.includes('permission-denied')) {
        showToast('আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই আগে ডিপোজিট করুন।', 'error');
      } else {
        showToast('ক্রয় সম্পন্ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const regularPlans = [
    { id: 1, name: 'Plan 1', daily: 'Tk 40.00', total: 'Tk 1200.00', price: '500', img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Plan 2', daily: 'Tk 80.00', total: 'Tk 2400.00', price: '1000', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Plan 3', daily: 'Tk 120.00', total: 'Tk 3600.00', price: '1500', img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Plan 4', daily: 'Tk 160.00', total: 'Tk 4800.00', price: '2000', img: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&w=400&q=80' },
    { id: 5, name: 'Plan 5', daily: 'Tk 200.00', total: 'Tk 6000.00', price: '2500', img: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=400&q=80' },
    { id: 6, name: 'Plan 6', daily: 'Tk 240.00', total: 'Tk 7200.00', price: '3000', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=400&q=80' },
    { id: 7, name: 'Plan 7', daily: 'Tk 320.00', total: 'Tk 9600.00', price: '4000', img: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=400&q=80' },
    { id: 8, name: 'Plan 8', daily: 'Tk 400.00', total: 'Tk 12000.00', price: '5000', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80' },
  ];

  const premiumPlans = [
    { id: 101, name: 'Bronze', daily: 'Tk ???', total: 'Tk ???', price: '???', img: 'https://picsum.photos/seed/bronze/400/400' },
    { id: 102, name: 'Silver', daily: 'Tk ???', total: 'Tk ???', price: '???', img: 'https://picsum.photos/seed/silver/400/400' },
    { id: 103, name: 'Gold', daily: 'Tk ???', total: 'Tk ???', price: '???', img: 'https://picsum.photos/seed/gold/400/400' },
    { id: 104, name: 'Platinum', daily: 'Tk ???', total: 'Tk ???', price: '???', img: 'https://picsum.photos/seed/platinum/400/400' },
    { id: 105, name: 'Diamond', daily: 'Tk ???', total: 'Tk ???', price: '???', img: 'https://picsum.photos/seed/diamond/400/400' },
  ];

  const activePlans = planType === 'regular' ? regularPlans : premiumPlans;

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 relative transition-colors duration-300">
      {/* Custom Toast Notification */}
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

      <div className="text-center py-2 transition-colors duration-300">
        <h2 className="text-xl font-bold text-gray-800">পণ্য তালিকা</h2>
        <p className="text-gray-400 text-xs">আপনার পছন্দের প্ল্যানটি বেছে নিন</p>
      </div>

      {/* Plan Type Tabs */}
      <div className="flex bg-[#f1f2f6] p-1 rounded-2xl mx-2 border border-gray-100 shadow-inner">
        <button 
          onClick={() => setPlanType('regular')}
          className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${
            planType === 'regular' 
              ? 'bg-white text-[#059669] shadow-md border-2 border-[#059669]' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Regular Plans
        </button>
        <button 
          onClick={() => setPlanType('premium')}
          className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${
            planType === 'premium' 
              ? 'bg-white text-[#D4AF37] shadow-md border-2 border-[#D4AF37]' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Premium Plans
        </button>
      </div>

      {activePlans.map((plan) => (
        <div key={plan.id} className={`bg-white rounded-2xl p-3 shadow-sm border-2 flex flex-col gap-3 relative overflow-hidden transition-all duration-300 ${
          planType === 'premium' ? 'border-[#D4AF37]/20' : 'border-[#059669]/20'
        }`}>
          {planType === 'premium' && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow-lg">
              Coming Soon
            </div>
          )}
          
          <div className="flex gap-3">
            <div className={`w-20 h-20 rounded-lg overflow-hidden shadow-md shrink-0 ${planType === 'premium' ? 'grayscale opacity-60' : ''}`}>
              <img 
                src={plan.img} 
                alt={plan.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div>
                <h3 className={`text-lg font-bold mb-0.5 ${planType === 'regular' ? 'text-gray-800' : 'text-[#D4AF37]'}`}>{plan.name}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="bg-orange-50 text-orange-500 text-[8px] font-bold px-1 py-0.5 rounded-md">রাজস্ব চক্র</span>
                  <span className="text-gray-400 text-[8px] font-bold">{planType === 'regular' ? '30 দিন' : '60 দিন'}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <p className={`text-[10px] font-bold ${planType === 'regular' ? 'text-[#059669]' : 'text-[#D4AF37]'}`}>{plan.daily}</p>
                  <p className="text-[8px] text-gray-400 font-medium uppercase">দৈনিক আয়</p>
                </div>
                <div>
                  <p className={`text-[10px] font-bold ${planType === 'regular' ? 'text-[#059669]' : 'text-[#D4AF37]'}`}>{plan.total}</p>
                  <p className="text-[8px] text-gray-400 font-medium uppercase">মোট আয়</p>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => handleBuy(plan)}
            disabled={planType === 'premium' || loading || purchasedPlans.includes(plan.id.toString())}
            className={`w-full py-2.5 rounded-lg font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
              purchasedPlans.includes(plan.id.toString())
                ? 'bg-emerald-100 text-[#059669] border border-[#059669]'
                : planType === 'regular' 
                  ? 'bg-[#059669] text-white shadow-[#059669]/20 active:scale-[0.98]' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading && !purchasedPlans.includes(plan.id.toString()) && <Loader2 size={16} className="animate-spin" />}
            {purchasedPlans.includes(plan.id.toString()) 
              ? <><CheckCircle2 size={16} /> Active</> 
              : planType === 'regular' ? `কিনুন Tk ${plan.price}` : 'Coming Soon'}
          </button>
        </div>
      ))}
    </div>
  );
};
