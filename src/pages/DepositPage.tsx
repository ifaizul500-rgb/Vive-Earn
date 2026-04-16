import React, { useState } from 'react';
import { Wallet, CheckCircle2, Copy } from 'lucide-react';
import { Page } from '../types';

export const DepositPage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | null>(null);
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  
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

  return (
    <div className="flex flex-col gap-3 pb-24 px-4 bg-[#f8f9fa] min-h-screen">
      <div className="flex items-center gap-2.5 py-2.5">
        <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center text-white shadow-lg shadow-[#059669]/20">
          <Wallet size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">টাকা জমা দিন (Deposit)</h2>
      </div>

      {/* Method Selection at Top */}
      <div className="grid grid-cols-2 gap-4 mb-4 max-w-[340px] mx-auto">
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
            className={`p-4 rounded-2xl bg-white border-2 transition-all flex flex-col items-center gap-2 shadow-sm ${
              selectedMethod === method.id ? `${method.color} scale-[1.05] shadow-md` : 'border-transparent'
            }`}
          >
            <div className={`w-24 h-16 rounded-xl ${method.bg} flex items-center justify-center p-2 overflow-hidden`}>
              <img 
                src={method.img} 
                alt={method.name} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<span class="text-xs font-black ${method.id === 'bKash' ? 'text-[#e2136e]' : 'text-[#f7941d]'}">${method.name}</span>`;
                }}
              />
            </div>
            <span className={`text-[11px] font-bold ${selectedMethod === method.id ? 'text-gray-900' : 'text-gray-500'}`}>
              {method.name}
            </span>
          </button>
        ))}
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
            <p className="text-pink-600 font-bold text-center text-[10px] leading-relaxed">
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

          <button className="w-full bg-[#059669] text-white py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-[#059669]/20 mt-1 active:scale-[0.98] transition-all">
            ডিপোজিট নিশ্চিত করুন
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-[2rem] border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
            <Wallet size={32} />
          </div>
          <h3 className="text-gray-800 font-bold mb-1">পেমেন্ট মেথড সিলেক্ট করুন</h3>
          <p className="text-gray-400 text-[10px] text-center">টাকা জমা দিতে উপরে বিকাশ অথবা নগদ সিলেক্ট করুন</p>
        </div>
      )}
    </div>
  );
};
