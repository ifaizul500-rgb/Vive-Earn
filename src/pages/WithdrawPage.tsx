import React, { useState } from 'react';
import { ArrowDownLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Page } from '../types';
import { collection, addDoc, doc, updateDoc, getDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';

export const WithdrawPage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | null>(null);
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleWithdraw = async () => {
    if (!amount || !phoneNumber || !selectedMethod || !auth.currentUser) return;
    const withdrawAmount = Number(amount);
    if (withdrawAmount < 500) return alert('সর্বনিম্ন উত্তোলন ৫০০ টাকা');

    setLoading(true);
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists() || (userSnap.data().balance || 0) < withdrawAmount) {
        alert('আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই');
        return;
      }

      // 1. Deduct balance first
      await updateDoc(userRef, {
        balance: increment(-withdrawAmount)
      });

      // 2. Create withdrawal request
      await addDoc(collection(db, 'transactions'), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.email?.split('@')[0],
        type: 'withdraw',
        amount: withdrawAmount,
        method: selectedMethod,
        accountNumber: phoneNumber,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      setTimeout(() => setPage('transaction'), 2000);
    } catch (error) {
      console.error(error);
      alert('ত্রুটি হয়েছে, আবার চেষ্টা করুন');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">অনুরোধ সফল হয়েছে!</h2>
        <p className="text-gray-500 text-xs mt-2">আপনার উত্তোলনের অনুরোধটি পেন্ডিং অবস্থায় আছে। যাচাই করার পর পেমেন্ট করা হবে।</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 bg-white min-h-screen transition-colors duration-300">
      <div className="flex items-center gap-3 py-3">
        <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-200">
          <ArrowDownLeft size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">টাকা উত্তোলন (Withdraw)</h2>
      </div>

      {/* Method Selection at Top */}
      <div className="grid grid-cols-2 gap-3 mb-2 max-w-[300px] mx-auto">
        {[
          { 
            id: 'bKash', 
            name: 'bKash', 
            color: 'border-[#e2136e]', 
            img: 'https://raw.githubusercontent.com/S-M-A-K-A-S-H/bKash-Nagad-Rocket-Logo/main/bkash.png',
            bg: 'bg-[#e2136e]/5'
          },
          { 
            id: 'Nagad', 
            name: 'Nagad', 
            color: 'border-[#f7941d]', 
            img: 'https://raw.githubusercontent.com/S-M-A-K-A-S-H/bKash-Nagad-Rocket-Logo/main/nagad.png',
            bg: 'bg-[#f7941d]/5'
          },
        ].map((method) => (
          <button 
            key={method.id} 
            onClick={() => setSelectedMethod(method.id as any)}
            className={`p-2.5 rounded-xl bg-white border-2 transition-all flex flex-col items-center gap-1.5 shadow-sm ${
              selectedMethod === method.id ? `${method.color} scale-[1.02] shadow-md` : 'border-transparent'
            }`}
          >
            <div className={`w-20 h-14 rounded-lg ${method.bg} flex items-center justify-center p-1.5 overflow-hidden`}>
              <img 
                src={method.img} 
                alt={method.name} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<span class="text-[10px] font-black ${method.id === 'bKash' ? 'text-[#e2136e]' : 'text-[#f7941d]'}">${method.name}</span>`;
                }}
              />
            </div>
            <span className={`text-[10px] font-bold ${selectedMethod === method.id ? 'text-gray-900' : 'text-gray-500'}`}>
              {method.name}
            </span>
          </button>
        ))}
      </div>

      {selectedMethod ? (
        <div className="p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${selectedMethod === 'bKash' ? 'bg-[#e2136e]' : 'bg-[#f7941d]'}`} />
            {selectedMethod} উত্তোলন ফর্ম:
          </h3>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase tracking-wider">উত্তোলনের পরিমাণ</label>
            <input 
              type="number" 
              placeholder="পরিমাণ লিখুন (সর্বনিম্ন ৫০০)" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#059669] transition-all text-sm font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase tracking-wider">একাউন্ট নম্বর ({selectedMethod})</label>
            <input 
              type="text" 
              placeholder={`আপনার ${selectedMethod} নম্বর লিখুন`} 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#059669] transition-all text-sm font-bold"
            />
          </div>

          <button 
            onClick={handleWithdraw}
            disabled={loading}
            className="w-full bg-[#059669] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#059669]/20 mt-2 text-base active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'প্রসেসিং হচ্ছে...' : 'উত্তোলন করুন'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 px-4 bg-white rounded-2xl border-[1.5px] border-black/10 shadow-sm mx-auto w-full max-w-[300px] transition-colors">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-3">
            <ArrowDownLeft size={24} />
          </div>
          <h3 className="text-gray-900 font-black text-sm mb-1 uppercase tracking-tight">পেমেন্ট মেথড সিলেক্ট করুন</h3>
          <p className="text-gray-400 text-[9px] text-center">টাকা উত্তোলন করতে উপরে বিকাশ অথবা নগদ সিলেক্ট করুন</p>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
        <p className="text-orange-600 text-[10px] font-medium leading-relaxed">
          দ্রষ্টব্য: উত্তোলন অনুমোদনে ২৪-৪৮ ঘণ্টা সময় লাগতে পারে। সঠিক তথ্য প্রদান নিশ্চিত করুন।
        </p>
      </div>
    </div>
  );
};
