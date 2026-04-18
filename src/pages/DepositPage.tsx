import React, { useState } from 'react';
import { Wallet, CheckCircle2, Copy, Loader2, Gift } from 'lucide-react';
import { Page } from '../types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

export const DepositPage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | null>(null);
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const numbers = {
    bKash: "01700000000",
    Nagad: "01800000000"
  };

  const copyToClipboard = () => {
    if (!selectedMethod) return;
    navigator.clipboard.writeText(numbers[selectedMethod]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = async () => {
    if (!amount || !transactionId || !selectedMethod) return;
    if (Number(amount) < 500) return alert('সর্বনিম্ন ডিপোজিট ৫০০ টাকা');

    setLoading(true);
    try {
      await addDoc(collection(db, 'transactions'), {
        uid: auth.currentUser?.uid,
        userName: auth.currentUser?.email?.split('@')[0],
        type: 'deposit',
        amount: Number(amount),
        method: selectedMethod,
        trxId: transactionId,
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
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">অনুরোধ সফল হয়েছে!</h2>
        <p className="text-gray-500 text-xs mt-2">আপনার ডিপোজিট অনুরোধটি পেন্ডিং অবস্থায় আছে। যাচাই করার পর ব্যালেন্স যোগ করা হবে।</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pb-24 px-4 bg-white min-h-screen transition-colors duration-300">
      <div className="flex items-center gap-2.5 py-2.5">
        <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center text-white shadow-lg shadow-[#059669]/20">
          <Wallet size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">টাকা জমা দিন (Deposit)</h2>
      </div>

      {/* Method Selection at Top */}
      <div className="grid grid-cols-2 gap-3 mb-4 max-w-[300px] mx-auto">
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

      {/* Bonus Information Card */}
      <div className="mx-auto w-full max-w-[340px] mb-4 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-700 mb-3">
          <Gift size={18} className="animate-bounce" />
          <h3 className="text-sm font-black uppercase tracking-wide">প্রথম ডিপোজিট বোনাস :</h3>
        </div>
        <div className="space-y-2">
          {[
            { deposit: "১০০০", bonus: "৫০০" },
            { deposit: "২০০০", bonus: "১০০০" },
            { deposit: "৫০০০", bonus: "২০০০" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-[11px] font-bold text-gray-700 bg-white/60 p-2 rounded-lg border border-emerald-100/50">
              <span className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                {item.deposit} টাকা ডিপোজিটে
              </span>
              <span className="text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-full">{item.bonus} টাকা বোনাস</span>
            </div>
          ))}
        </div>
      </div>

      {selectedMethod ? (
        <div className="p-4 rounded-[1.5rem] bg-white border border-gray-100 flex flex-col gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${selectedMethod === 'bKash' ? 'bg-[#e2136e]' : 'bg-[#f7941d]'}`} />
            {selectedMethod} পেমেন্ট নির্দেশাবলী:
          </h3>
          
          <div className="p-3 rounded-xl bg-[#f1f2f6] border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-[8px] font-bold text-gray-400 uppercase mb-0.5">{selectedMethod} নম্বর (PERSONAL)</p>
              <p className="text-lg font-bold text-[#2f3542] tracking-wider">{numbers[selectedMethod]}</p>
            </div>
            <button onClick={copyToClipboard} className="text-[#059669] p-2 bg-white rounded-lg shadow-sm active:scale-95 transition-all">
              {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            </button>
          </div>

          <div className="space-y-2">
            <p className={`font-bold text-center text-[10px] leading-relaxed ${selectedMethod === 'bKash' ? 'text-[#e2136e]' : 'text-[#f7941d]'}`}>
              {selectedMethod} থেকে উক্ত নাম্বারে সেন্ড মানি করতে হবে। ক্যাশ আউট গ্রহণযোগ্য নয়।
            </p>
            <p className="text-gray-400 text-[9px] text-center leading-relaxed">
              দ্রষ্টব্য: সর্বনিম্ন ডিপোজিট ৫০০ টাকা। সঠিক ট্রানজেকশন আইডি প্রদান করুন।
            </p>
          </div>

          {/* Input Fields */}
          <div className="space-y-3 mt-1">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase">টাকার পরিমাণ (Amount)</label>
              <input 
                type="number" 
                placeholder="৫০০ - ২৫০০০"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#f1f2f6] border border-gray-100 focus:border-[#059669] focus:ring-1 focus:ring-[#059669] outline-none transition-all font-bold text-gray-700 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase">ট্রানজেকশন আইডি (Transaction ID)</label>
              <input 
                type="text" 
                placeholder="Ex: 8N7V6C5X4"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#f1f2f6] border border-gray-100 focus:border-[#059669] focus:ring-1 focus:ring-[#059669] outline-none transition-all font-bold text-gray-700 uppercase text-xs"
              />
            </div>
          </div>

          <button 
            onClick={handleDeposit}
            disabled={loading}
            className="w-full bg-[#059669] text-white py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-[#059669]/20 mt-1 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'প্রসেসিং হচ্ছে...' : 'ডিপোজিট নিশ্চিত করুন'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 px-4 bg-white rounded-2xl border-[1.5px] border-black/10 shadow-sm mx-auto w-full max-w-[300px] transition-colors">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-3">
            <Wallet size={24} />
          </div>
          <h3 className="text-gray-900 font-black text-sm mb-1 uppercase tracking-tight">পেমেন্ট মেথড সিলেক্ট করুন</h3>
          <p className="text-gray-400 text-[9px] text-center">টাকা জমা দিতে উপরে বিকাশ অথবা নগদ সিলেক্ট করুন</p>
        </div>
      )}
    </div>
  );
};
